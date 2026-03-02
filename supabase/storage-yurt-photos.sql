-- Run in Supabase SQL Editor: Storage bucket + policies for yurt photos

-- Create bucket (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('yurt-photos', 'yurt-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: public read
CREATE POLICY "Public read yurt photos" ON storage.objects
FOR SELECT USING (bucket_id = 'yurt-photos');

-- Policy: authenticated users can upload
CREATE POLICY "Authenticated upload yurt photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'yurt-photos' AND auth.role() = 'authenticated'
);

-- Optional: allow update/delete for own uploads
CREATE POLICY "Authenticated update yurt photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'yurt-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated delete yurt photos" ON storage.objects
FOR DELETE USING (bucket_id = 'yurt-photos' AND auth.role() = 'authenticated');
