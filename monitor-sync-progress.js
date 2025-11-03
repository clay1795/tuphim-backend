const mongoose = require('mongoose');
require('dotenv').config();

const movieSchema = new mongoose.Schema({
  _id: String,
  name: String,
  slug: String,
  last_sync: Date
}, { timestamps: true });

const Movie = mongoose.model('Movie', movieSchema);

async function monitorProgress() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔌 Connected to MongoDB for monitoring');
    
    let lastCount = 0;
    let stableCount = 0;
    
    console.log('📊 Starting sync progress monitoring...\n');
    
    const interval = setInterval(async () => {
      try {
        const currentCount = await Movie.countDocuments();
        const recentMovies = await Movie.find({})
          .sort({ last_sync: -1 })
          .limit(3)
          .select('name slug last_sync');
        
        console.log(`⏰ ${new Date().toLocaleTimeString()}`);
        console.log(`📊 Current movie count: ${currentCount}`);
        
        if (currentCount > lastCount) {
          console.log(`📈 Progress: +${currentCount - lastCount} movies since last check`);
          lastCount = currentCount;
          stableCount = 0;
        } else if (currentCount === lastCount && currentCount > 0) {
          stableCount++;
          console.log(`⏸️  No new movies (stable for ${stableCount} checks)`);
        }
        
        if (recentMovies.length > 0) {
          console.log(`🎬 Latest movies:`);
          recentMovies.forEach((movie, index) => {
            console.log(`   ${index + 1}. ${movie.name} (${movie.slug})`);
          });
        }
        
        console.log('─'.repeat(50));
        
        // If count is stable for 10 checks (5 minutes), sync might be done
        if (stableCount >= 10) {
          console.log('🏁 Sync appears to be complete!');
          console.log(`📊 Final movie count: ${currentCount}`);
          clearInterval(interval);
          await mongoose.disconnect();
          process.exit(0);
        }
        
      } catch (error) {
        console.error('❌ Error monitoring:', error.message);
      }
    }, 30000); // Check every 30 seconds
    
    // Stop monitoring after 60 minutes
    setTimeout(() => {
      console.log('⏰ Monitoring timeout reached (60 minutes)');
      clearInterval(interval);
      mongoose.disconnect();
      process.exit(0);
    }, 60 * 60 * 1000);
    
  } catch (error) {
    console.error('❌ Monitoring failed:', error.message);
    process.exit(1);
  }
}

monitorProgress();



