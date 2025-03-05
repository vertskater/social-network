const {createClient} = require('@supabase/supabase-js');
require('dotenv').config({path: ".env.development"});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supaBaseAuthWithPassword = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.SUPABASE_EMAIL,
    password: process.env.SUPABASE_PASSWORD,
  });
  return data.session.access_token;
};

module.exports = { supabase, supaBaseAuthWithPassword };