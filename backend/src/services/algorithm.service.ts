import { Enrollment } from '../models/Enrollment';
import { Timetable } from '../models/Timetable';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

interface ConflictGraph {
  [courseId: string]: Set<string>;
}

interface ColorAssignment {
  [courseId: string]: number;
}

export class AlgorithmService {
  /**
   * Build conflict graph from enrollments
   */
  private async buildConflictGraph(
    courseIds: string[]
  ): Promise<ConflictGraph> {
    const graph: ConflictGraph = {};

    courseIds.forEach((id) => {
      graph[id] = new Set();
    });

    const enrollments = await Enrollment.find({
      courseId: { $in: courseIds.map((id) => new Types.ObjectId(id)) },
      status: 'active',
    } as any).lean();

    const studentCourses = new Map<string, string[]>();

    enrollments.forEach((e: any) => {
      const studentId = e.studentId.toString();
      const courseId = e.courseId.toString();

      if (!studentCourses.has(studentId)) {
        studentCourses.set(studentId, []);
      }
      studentCourses.get(studentId)!.push(courseId);
    });

    studentCourses.forEach((courses) => {
      for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
          graph[courses[i]].add(courses[j]);
          graph[courses[j]].add(courses[i]);
        }
      }
    });

    return graph;
  }

  /**
   * Get degree of a vertex
   */
  private getDegree(graph: ConflictGraph, courseId: string): number {
    return graph[courseId].size;
  }

  /**
   * Greedy graph coloring algorithm
   */
  private greedyColoring(graph: ConflictGraph): ColorAssignment {
    const colors: ColorAssignment = {};
    const courseIds = Object.keys(graph);

    const sortedCourses = courseIds.sort(
      (a, b) => this.getDegree(graph, b) - this.getDegree(graph, a)
    );

    for (const courseId of sortedCourses) {
      const usedColors = new Set<number>();

      graph[courseId].forEach((neighbor) => {
        if (colors[neighbor] !== undefined) {
          usedColors.add(colors[neighbor]);
        }
      });

      let color = 0;
      while (usedColors.has(color)) {
        color++;
      }

      colors[courseId] = color;
    }

    return colors;
  }

  /**
   * Map color to time slot info
   */
  private mapColorToSlot(
    color: number,
    slotsPerDay: number
  ): {
    day: number;
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  } {
    const day = Math.floor(color / slotsPerDay) + 1;
    const slotIndex = color % slotsPerDay;

    if (slotIndex === 0) {
      return { day, timeSlot: 'Morning' };
    }
    if (slotIndex === 1) {
      return { day, timeSlot: 'Afternoon' };
    }
    return { day, timeSlot: 'Evening' };
  }

  /**
   * Calculate end time based on start time and duration
   */
  private calculateEndTime(
    startTime: string,
    durationMins: number
  ): string {
    const [hours, mins] = startTime.split(':').map(Number);
    const total = hours * 60 + mins + durationMins;

    const endHours = Math.floor(total / 60);
    const endMins = total % 60;

    return `${String(endHours).padStart(2, '0')}:${String(
      endMins
    ).padStart(2, '0')}`;
  }

  /**
   * Generate timetable using greedy graph coloring
   */
  async generateTimetable(timetableId: string): Promise<{
    success: boolean;
    slots: any[];
    stats: {
      totalSlotsUsed: number;
      totalDaysUsed: number;
      conflictsFound: number;
      generationTimeMs: number;
    };
  }> {
    const startTime = Date.now();

    try {
      const timetable = await Timetable.findById(timetableId);
      if (!timetable) {
        throw new Error('Timetable not found');
      }

      const courseIds = timetable.courseIds.map((id: any) =>
        id.toString()
      );

      const {
        slotsPerDay,
        examDurationMins,
        startDate,
        morningStartTime,
        afternoonStartTime,
        eveningStartTime,
      } = timetable.config;

      logger.info(`Starting timetable generation for ${timetableId}`);
      logger.info(`Courses: ${courseIds.length}, Slots/Day: ${slotsPerDay}`);

      // Step 1: Build conflict graph
      const graph = await this.buildConflictGraph(courseIds);
      logger.info('Conflict graph built');

      // Step 2: Apply greedy coloring
      const colors = this.greedyColoring(graph);
      logger.info('Graph coloring completed');

      // Step 3: Map colors to slots with dates and times
      const slots = courseIds.map((courseId) => {
        const color = colors[courseId];

        const { day, timeSlot } = this.mapColorToSlot(color, slotsPerDay);

        // Calculate exam date
        const baseDate = new Date(startDate);
        const examDate = new Date(baseDate);
        examDate.setDate(baseDate.getDate() + day - 1);

        // Determine start time based on session
        let slotStartTime = '';

        if (timeSlot === 'Morning') {
          slotStartTime = morningStartTime;
        } else if (timeSlot === 'Afternoon') {
          slotStartTime = afternoonStartTime;
        } else if (timeSlot === 'Evening') {
          slotStartTime = eveningStartTime || '18:00';
        }

        // Calculate end time
        const slotEndTime = this.calculateEndTime(
          slotStartTime,
          examDurationMins
        );

        return {
          courseId: new Types.ObjectId(courseId),
          slotNumber: color + 1,
          day,
          examDate,
          timeSlot,
          startTime: slotStartTime,
          endTime: slotEndTime,
        };
      });

      // Step 4: Calculate statistics
      const maxColor = Math.max(...Object.values(colors));
      const totalSlotsUsed = maxColor + 1;
      const totalDaysUsed = Math.ceil(totalSlotsUsed / slotsPerDay);
      const conflictsFound = 0;

      const generationTimeMs = Date.now() - startTime;

      logger.info(
        `Generation complete: ${totalSlotsUsed} slots, ${totalDaysUsed} days, ${generationTimeMs}ms`
      );

      return {
        success: true,
        slots,
        stats: {
          totalSlotsUsed,
          totalDaysUsed,
          conflictsFound,
          generationTimeMs,
        },
      };
    } catch (error) {
      logger.error('Error generating timetable:', error);
      throw error;
    }
  }

  /**
   * Validate if timetable can be generated
   */
  async validateTimetable(timetableId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    try {
      const timetable = await Timetable.findById(timetableId);
      if (!timetable) {
        return {
          valid: false,
          errors: ['Timetable not found'],
          warnings: [],
        };
      }

      const errors: string[] = [];
      const warnings: string[] = [];

      if (timetable.courseIds.length === 0) {
        errors.push('No courses selected');
      }

      if (
        timetable.config.slotsPerDay < 1 ||
        timetable.config.slotsPerDay > 3
      ) {
        errors.push('Slots per day must be between 1 and 3');
      }

      const estimatedSlots = timetable.courseIds.length;
      const maxSlots =
        timetable.config.slotsPerDay * timetable.config.maxDays;

      if (estimatedSlots > maxSlots) {
        warnings.push(
          `May need more days. Estimated: ${estimatedSlots} slots, Available: ${maxSlots} slots`
        );
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      logger.error('Error validating timetable:', error);
      return {
        valid: false,
        errors: ['Validation failed'],
        warnings: [],
      };
    }
  }
}

export const algorithmService = new AlgorithmService();