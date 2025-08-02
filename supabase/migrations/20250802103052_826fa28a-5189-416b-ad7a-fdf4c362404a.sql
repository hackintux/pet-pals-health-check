-- Create feedbacks table
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to view and create feedbacks
CREATE POLICY "Anyone can view feedbacks" 
ON public.feedbacks 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create feedbacks" 
ON public.feedbacks 
FOR INSERT 
WITH CHECK (true);