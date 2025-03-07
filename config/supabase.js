const {createClient} = require('@supabase/supabase-js');
require('dotenv').config({path: ".env.development"});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const supabaseAuthWithPassword = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(process.env.SUPABASE_EMAIL),
    password: String(process.env.SUPABAE_PASSWORD),
  });
  if(error) {
    console.error('invalid credentials', error)
    return null;
  }
  return data.session.access_token;
};

module.exports = { supabase, supabaseAuthWithPassword };