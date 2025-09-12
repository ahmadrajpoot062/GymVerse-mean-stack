/**
 * Sample Data Seeding Script for GymVerse
 * Creates sample users, trainers, programs, and other data for testing
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Trainer = require('../models/Trainer');
const Program = require('../models/Program');
const Blog = require('../models/Blog');
const Newsletter = require('../models/Newsletter');

// Sample data
const sampleUsers = [
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      bio: 'Fitness enthusiast looking to get stronger',
      phone: '+1-555-0101',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      height: 180,
      weight: 75,
      fitnessLevel: 'intermediate',
      goals: ['lose_weight', 'build_muscle']
    }
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'user',
    profile: {
      bio: 'Yoga lover and runner',
      phone: '+1-555-0102',
      dateOfBirth: new Date('1988-08-22'),
      gender: 'female',
      height: 165,
      weight: 60,
      fitnessLevel: 'advanced',
      goals: ['stay_fit', 'flexibility']
    }
  },
  {
    name: 'Mike Wilson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'trainer',
    profile: {
      bio: 'Certified personal trainer with 8+ years experience',
      phone: '+1-555-0201',
      dateOfBirth: new Date('1985-03-10'),
      gender: 'male'
    }
  },
  {
    name: 'Admin User',
    email: 'admin@gymverse.com',
    password: 'Admin123!@#',
    role: 'admin',
    profile: {
      bio: 'GymVerse Platform Administrator',
      phone: '+1-555-0001'
    }
  }
];

const sampleTrainers = [
  {
    email: 'mike@example.com',
    name: 'Mike Wilson',
    phone: '+1-555-0201',
    bio: 'Certified personal trainer with 8+ years experience specializing in strength training and weight loss',
    specialty: ['strength-training', 'weight-loss', 'muscle-building'],
    experience: {
      years: 8,
      description: 'Worked with clients ranging from beginners to professional athletes'
    },
    applicationData: {
      motivation: 'I want to help people achieve their fitness goals and transform their lives through proper training and nutrition guidance.',
      previousExperience: 'Worked at several fitness centers and have been training clients privately for 8 years',
    },
    hourlyRate: 75,
    availability: {
      monday: [{ start: '06:00', end: '20:00' }],
      tuesday: [{ start: '06:00', end: '20:00' }],
      wednesday: [{ start: '06:00', end: '20:00' }],
      thursday: [{ start: '06:00', end: '20:00' }],
      friday: [{ start: '06:00', end: '20:00' }],
      saturday: [{ start: '08:00', end: '16:00' }]
    },
    status: 'approved',
    rating: 4.8,
    totalSessions: 150
  }
];

const samplePrograms = [
  {
    title: 'Beginner Strength Training',
    description: 'Perfect program for those new to weightlifting. Learn proper form and build a solid foundation.',
    category: 'strength-training',
    difficulty: 'beginner',
    duration: {
      weeks: 8,
      sessionsPerWeek: 3,
      sessionDuration: 60
    },
    pricing: {
      type: 'one-time',
      amount: 99.99
    },
    requirements: {
      fitnessLevel: 'beginner',
      equipment: ['basic-home-gym'],
      timeCommitment: '3 hours per week',
      space: 'small-room'
    },
    goals: ['strength-building', 'muscle-gain', 'general-fitness'],
    workouts: [
      {
        name: 'Full Body Workout A',
        exercises: [
          { name: 'Squats', sets: 3, reps: 12, restTime: 60 },
          { name: 'Push-ups', sets: 3, reps: 10, restTime: 60 },
          { name: 'Bent-over Rows', sets: 3, reps: 12, restTime: 60 },
          { name: 'Planks', sets: 3, duration: 30, restTime: 60 }
        ]
      },
      {
        name: 'Full Body Workout B',
        exercises: [
          { name: 'Deadlifts', sets: 3, reps: 8, restTime: 90 },
          { name: 'Shoulder Press', sets: 3, reps: 10, restTime: 60 },
          { name: 'Lunges', sets: 3, reps: 12, restTime: 60 },
          { name: 'Side Planks', sets: 3, duration: 20, restTime: 60 }
        ]
      }
    ],
    isActive: true
  },
  {
    title: 'Fat Loss HIIT Program',
    description: 'High-intensity interval training designed for maximum fat burning in minimal time.',
    category: 'hiit',
    difficulty: 'intermediate',
    duration: {
      weeks: 6,
      sessionsPerWeek: 4,
      sessionDuration: 30
    },
    pricing: {
      type: 'one-time',
      amount: 79.99
    },
    requirements: {
      fitnessLevel: 'intermediate',
      equipment: ['bodyweight-only'],
      timeCommitment: '2 hours per week',
      space: 'minimal'
    },
    goals: ['weight-loss', 'endurance', 'general-fitness'],
    workouts: [
      {
        name: 'HIIT Circuit A',
        exercises: [
          { name: 'Burpees', sets: 4, reps: 10, restTime: 30 },
          { name: 'Mountain Climbers', sets: 4, duration: 30, restTime: 30 },
          { name: 'Jump Squats', sets: 4, reps: 15, restTime: 30 },
          { name: 'High Knees', sets: 4, duration: 30, restTime: 30 }
        ]
      }
    ],
    isActive: true
  }
];

const sampleBlogs = [
  {
    title: 'The Ultimate Guide to Building Muscle Mass',
    content: `
# The Ultimate Guide to Building Muscle Mass

Building muscle mass is one of the most common fitness goals, yet many people struggle to see significant results. This comprehensive guide will walk you through the essential principles of muscle building.

## Understanding Muscle Growth

Muscle growth, or hypertrophy, occurs when your muscles are subjected to stress and then given adequate time to recover and rebuild stronger. This process is influenced by several key factors:

### 1. Progressive Overload
The principle of progressive overload is fundamental to muscle building. You must gradually increase the stress placed on your muscles over time through:
- Increasing weight
- Adding more repetitions
- Performing more sets
- Reducing rest time between sets

### 2. Proper Nutrition
Your diet plays a crucial role in muscle building:
- **Protein**: Aim for 1.6-2.2g per kg of body weight daily
- **Carbohydrates**: Fuel your workouts with complex carbs
- **Fats**: Support hormone production with healthy fats
- **Hydration**: Stay well-hydrated for optimal performance

### 3. Adequate Rest and Recovery
Muscles grow during rest, not during workouts:
- Get 7-9 hours of quality sleep
- Allow 48-72 hours between training the same muscle groups
- Manage stress levels

## Effective Training Strategies

### Compound Movements
Focus on exercises that work multiple muscle groups:
- Squats
- Deadlifts
- Bench Press
- Pull-ups
- Overhead Press

### Rep and Set Ranges
For muscle building:
- **Sets**: 3-5 sets per exercise
- **Reps**: 6-12 reps for hypertrophy
- **Rest**: 2-3 minutes between sets

## Conclusion

Building muscle mass requires consistency, patience, and adherence to proven principles. Focus on progressive overload, eat adequate protein, and prioritize recovery for the best results.
    `,
    category: 'training',
    tags: ['muscle building', 'strength training', 'nutrition', 'fitness'],
    published: true,
    featuredImage: '/uploads/blog/muscle-building-guide.jpg',
    readTime: 8
  },
  {
    title: '10 Nutrition Myths That Are Sabotaging Your Results',
    content: `
# 10 Nutrition Myths That Are Sabotaging Your Results

The fitness industry is filled with misinformation about nutrition. Let's debunk some common myths that might be holding you back.

## Myth 1: Carbs Make You Fat
**Truth**: Excess calories make you fat, not carbs specifically. Carbohydrates are your body's preferred energy source and are essential for optimal performance.

## Myth 2: You Need to Eat Every 2-3 Hours
**Truth**: Meal frequency doesn't significantly impact metabolism. Focus on total daily calories and macronutrients instead.

## Myth 3: All Calories Are Equal
**Truth**: While calories matter for weight management, the source of those calories affects satiety, metabolism, and body composition.

## Myth 4: Fat Makes You Fat
**Truth**: Healthy fats are essential for hormone production and overall health. The key is choosing the right types and amounts.

## Myth 5: Supplements Are Necessary
**Truth**: A well-balanced diet can provide most nutrients. Supplements should supplement, not replace, whole foods.

Stay tuned for myths 6-10 in our next post!
    `,
    category: 'nutrition',
    tags: ['nutrition', 'myths', 'diet', 'health'],
    published: true,
    featuredImage: '/uploads/blog/nutrition-myths.jpg',
    readTime: 5
  }
];

const sampleNewsletterSubscribers = [
  {
    email: 'subscriber1@example.com',
    firstName: 'Alex',
    lastName: 'Brown',
    preferences: {
      frequency: 'weekly',
      categories: ['fitness', 'nutrition', 'wellness']
    }
  },
  {
    email: 'subscriber2@example.com',
    firstName: 'Emma',
    lastName: 'Davis',
    preferences: {
      frequency: 'monthly',
      categories: ['training', 'lifestyle']
    }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymverse';
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Trainer.deleteMany({});
    await Program.deleteMany({});
    await Blog.deleteMany({});
    await Newsletter.deleteMany({});
    console.log('Existing data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    for (const userData of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      userData.password = await bcrypt.hash(userData.password, salt);
      
      const user = new User(userData);
      await user.save();
    }
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

// Seed trainers
const seedTrainers = async () => {
  try {
    for (const trainerData of sampleTrainers) {
      // Find the user first
      const user = await User.findOne({ email: trainerData.email });
      if (user) {
        trainerData.user = user._id;
        const trainer = new Trainer(trainerData);
        await trainer.save();
      }
    }
    console.log('Trainers seeded successfully');
  } catch (error) {
    console.error('Error seeding trainers:', error);
  }
};

// Seed programs
const seedPrograms = async () => {
  try {
    // Find a trainer to assign programs to
    const trainer = await Trainer.findOne({ status: 'approved' });
    
    for (const programData of samplePrograms) {
      if (trainer) {
        programData.trainer = trainer._id;
      }
      const program = new Program(programData);
      await program.save();
    }
    console.log('Programs seeded successfully');
  } catch (error) {
    console.error('Error seeding programs:', error);
  }
};

// Seed blogs
const seedBlogs = async () => {
  try {
    // Find a user to assign as author
    const author = await User.findOne({ role: 'trainer' }) || await User.findOne({ role: 'admin' });
    
    for (const blogData of sampleBlogs) {
      if (author) {
        blogData.author = author._id;
      }
      // Generate slug from title
      blogData.slug = blogData.title.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log('Blogs seeded successfully');
  } catch (error) {
    console.error('Error seeding blogs:', error);
  }
};

// Seed newsletter subscribers
const seedNewsletter = async () => {
  try {
    for (const subscriberData of sampleNewsletterSubscribers) {
      const subscriber = new Newsletter(subscriberData);
      await subscriber.save();
    }
    console.log('Newsletter subscribers seeded successfully');
  } catch (error) {
    console.error('Error seeding newsletter:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    await clearData();
    await seedUsers();
    await seedTrainers();
    await seedPrograms();
    await seedBlogs();
    await seedNewsletter();
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\nSample accounts created:');
    console.log('Admin: admin@gymverse.com / Admin123!@#');
    console.log('User: john@example.com / password123');
    console.log('Trainer: mike@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearData,
  seedUsers,
  seedTrainers,
  seedPrograms,
  seedBlogs,
  seedNewsletter
};
