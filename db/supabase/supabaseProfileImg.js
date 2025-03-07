const {supabase} = require('../../config/supabase');

const saveProfileImageToSupabase = async (bucketname, filepath, file, token) => {
  const { buffer, mimetype } = file;
  const { data, error } = await supabase.storage
    .from(bucketname)
    .upload(filepath, buffer, {
      contentType: mimetype,
      headers: { Authorization: `Bearer ${token}` },
    });
  if(error) {
    console.error(error.message);
    return null;
  }
  return data;
}

const deleteProfileImageFromSupabase = async (bucketname, path) => {
  const {data, error} = await supabase.storage
    .from(bucketname)
    .remove(path);
  if(error) {
    console.error(error.message);
    return null
  }
  return data
}

module.exports = {
  saveProfileImageToSupabase,
  deleteProfileImageFromSupabase
}