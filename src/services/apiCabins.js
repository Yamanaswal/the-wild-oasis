import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {

  let imagePath = null;
  let hasImagePath = null;
  let imageName = null;

  if (newCabin.image) {

    hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

    imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
      "/",
      ""
    );

    imagePath = hasImagePath
      ? newCabin.image
      : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  }

  // 1. Create/edit cabin
  let query = supabase.from("cabins");

  // Create Object
  const request = { ...newCabin, image: imagePath ?? null };

  // A) CREATE
  if (!id) query = query.insert([request]);

  // B) EDIT
  if (id) query = query.update(request).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be created");
  }

  // 2. Upload image
  if (hasImagePath) {
    return data;
  }

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. Delete the cabin IF there was an error uplaoding image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted.");
  }

  return data;
}
