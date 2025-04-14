const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API endpoint for form submission
app.post('/api/submit-application', async (req, res) => {
    try {
      // Log the incoming request for debugging
      console.log('Received form submission:', req.body);
      
      const { fullName, email, companyName, description } = req.body;
      
      // Check if we have all required fields
      if (!fullName || !email || !companyName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }
      
      // Attempt Supabase insertion with error logging
      const { data, error } = await supabase
        .from('startup_applications')
        .insert([{ 
          full_name: fullName, 
          email: email, 
          company_name: companyName, 
          description: description 
        }]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Form submitted successfully');
      res.status(200).json({ success: true, message: 'Application submitted successfully!' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ success: false, message: 'Error submitting application.' });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});