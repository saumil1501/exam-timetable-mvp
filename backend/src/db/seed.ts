// import { Course } from '../models/Course';
// import { Student } from '../models/Student';
// import { Enrollment } from '../models/Enrollment';
// import { logger } from '../utils/logger';

// export async function seedDatabase(): Promise<void> {
//   try {
//     // Check if data already exists
//     const courseCount = await Course.countDocuments();
//     if (courseCount > 0) {
//       logger.info('Database already seeded, skipping...');
//       return;
//     }

//     logger.info('🌱 Seeding database with sample data...');

//     // Sample courses
//     const coursesData = [
//       {
//         code: 'CS101',
//         name: 'Data Structures',
//         department: 'Computer Science',
//         credits: 3,
//         semester: 1,
//       },
//       {
//         code: 'CS102',
//         name: 'Algorithms',
//         department: 'Computer Science',
//         credits: 3,
//         semester: 2,
//       },
//       {
//         code: 'CS201',
//         name: 'Database Systems',
//         department: 'Computer Science',
//         credits: 3,
//         semester: 3,
//       },
//       {
//         code: 'MA101',
//         name: 'Calculus I',
//         department: 'Mathematics',
//         credits: 4,
//         semester: 1,
//       },
//       {
//         code: 'MA102',
//         name: 'Linear Algebra',
//         department: 'Mathematics',
//         credits: 4,
//         semester: 2,
//       },
//       {
//         code: 'PH101',
//         name: 'Physics I',
//         department: 'Physics',
//         credits: 4,
//         semester: 1,
//       },
//       {
//         code: 'PH102',
//         name: 'Physics II',
//         department: 'Physics',
//         credits: 4,
//         semester: 2,
//       },
//       {
//         code: 'EE101',
//         name: 'Circuits',
//         department: 'Electrical Engineering',
//         credits: 3,
//         semester: 1,
//       },
//       {
//         code: 'EE102',
//         name: 'Electronics',
//         department: 'Electrical Engineering',
//         credits: 3,
//         semester: 2,
//       },
//       {
//         code: 'CH101',
//         name: 'Chemistry I',
//         department: 'Chemistry',
//         credits: 4,
//         semester: 1,
//       },
//     ];

//     const courses = await Course.insertMany(coursesData);
//     logger.info(`✓ Created ${courses.length} courses`);

//     // Sample students
//     const studentsData = [
//       {
//         studentCode: 'STU001',
//         name: 'John Doe',
//         email: 'john@example.com',
//         department: 'Computer Science',
//         semester: 2,
//       },
//       {
//         studentCode: 'STU002',
//         name: 'Jane Smith',
//         email: 'jane@example.com',
//         department: 'Computer Science',
//         semester: 2,
//       },
//       {
//         studentCode: 'STU003',
//         name: 'Bob Wilson',
//         email: 'bob@example.com',
//         department: 'Mathematics',
//         semester: 1,
//       },
//       {
//         studentCode: 'STU004',
//         name: 'Alice Brown',
//         email: 'alice@example.com',
//         department: 'Physics',
//         semester: 1,
//       },
//       {
//         studentCode: 'STU005',
//         name: 'Charlie Davis',
//         email: 'charlie@example.com',
//         department: 'Electrical Engineering',
//         semester: 1,
//       },
//       {
//         studentCode: 'STU006',
//         name: 'Diana Evans',
//         email: 'diana@example.com',
//         department: 'Computer Science',
//         semester: 3,
//       },
//       {
//         studentCode: 'STU007',
//         name: 'Eve Foster',
//         email: 'eve@example.com',
//         department: 'Chemistry',
//         semester: 1,
//       },
//       {
//         studentCode: 'STU008',
//         name: 'Frank Garcia',
//         email: 'frank@example.com',
//         department: 'Physics',
//         semester: 2,
//       },
//     ];

//     const students = await Student.insertMany(studentsData);
//     logger.info(`✓ Created ${students.length} students`);

//     // Sample enrollments
//     const enrollmentsData = [
//       // STU001 - John (CS courses)
//       { studentId: students[0]._id, courseId: courses[0]._id },
//       { studentId: students[0]._id, courseId: courses[1]._id },
//       { studentId: students[0]._id, courseId: courses[3]._id }, // Conflict with STU002

//       // STU002 - Jane (CS courses)
//       { studentId: students[1]._id, courseId: courses[0]._id }, // Conflict
//       { studentId: students[1]._id, courseId: courses[1]._id }, // Conflict
//       { studentId: students[1]._id, courseId: courses[5]._id },

//       // STU003 - Bob (Math courses)
//       { studentId: students[2]._id, courseId: courses[3]._id },
//       { studentId: students[2]._id, courseId: courses[4]._id },

//       // STU004 - Alice (Physics courses)
//       { studentId: students[3]._id, courseId: courses[5]._id },
//       { studentId: students[3]._id, courseId: courses[6]._id },

//       // STU005 - Charlie (EE courses)
//       { studentId: students[4]._id, courseId: courses[7]._id },
//       { studentId: students[4]._id, courseId: courses[8]._id },

//       // STU006 - Diana (CS & Math)
//       { studentId: students[5]._id, courseId: courses[2]._id },
//       { studentId: students[5]._id, courseId: courses[0]._id },
//       { studentId: students[5]._id, courseId: courses[4]._id },

//       // STU007 - Eve (Chemistry & Physics)
//       { studentId: students[6]._id, courseId: courses[9]._id },
//       { studentId: students[6]._id, courseId: courses[5]._id },

//       // STU008 - Frank (Physics & EE)
//       { studentId: students[7]._id, courseId: courses[6]._id },
//       { studentId: students[7]._id, courseId: courses[7]._id },
//     ];

//     await Enrollment.insertMany(enrollmentsData);
//     logger.info(`✓ Created ${enrollmentsData.length} enrollments`);

//     logger.info('✅ Database seeded successfully!');
//   } catch (error) {
//     logger.error('Error seeding database:', error);
//     throw error;
//   }
// }