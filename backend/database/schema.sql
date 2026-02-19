-- AAROHA 2026 - Battle of Bands: SARGAM
-- Database Schema for Supabase with Authentication

-- =====================================================
-- USER PROFILES TABLE (for both Teams and Admins)
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    college_name VARCHAR(200),
    role VARCHAR(20) NOT NULL DEFAULT 'team' CHECK (role IN ('team', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- REGISTRATIONS TABLE (Team registrations for the event)
-- =====================================================
CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    registration_id UUID UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    team_name VARCHAR(100) NOT NULL,
    college_name VARCHAR(200) NOT NULL,
    team_leader_name VARCHAR(100) NOT NULL,
    team_leader_email VARCHAR(255) NOT NULL,
    team_leader_phone VARCHAR(15) NOT NULL,
    team_members JSONB NOT NULL DEFAULT '[]',
    num_microphones INTEGER NOT NULL DEFAULT 1,
    drum_setup TEXT NOT NULL,
    additional_requirements TEXT,
    instagram_handle VARCHAR(50),
    registration_fee INTEGER NOT NULL DEFAULT 1200,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(100),
    registration_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on registration_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON registrations(registration_id);

-- Create index on team_leader_email
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(team_leader_email);

-- Create index on payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

-- Create index on registration_status for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(registration_status);

-- Create index on user_id for user's registrations
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER_PROFILES POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow profile creation during signup
CREATE POLICY "Allow profile creation" ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON user_profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- REGISTRATIONS POLICIES
-- =====================================================

-- Anyone can create a registration (public registration)
CREATE POLICY "Allow public registration" ON registrations
    FOR INSERT
    WITH CHECK (true);

-- Users can read their own registrations
CREATE POLICY "Users can read own registrations" ON registrations
    FOR SELECT
    USING (user_id = auth.uid() OR user_id IS NULL);

-- Admins can read all registrations
CREATE POLICY "Admins can read all registrations" ON registrations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON registrations
    FOR UPDATE
    USING (user_id = auth.uid());

-- Admins can update any registration
CREATE POLICY "Admins can update all registrations" ON registrations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- HELPER FUNCTION: Check if user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CREATE FIRST ADMIN (Run this manually after setup)
-- Replace the values with actual admin credentials
-- =====================================================
-- INSERT INTO user_profiles (user_id, email, name, phone, role)
-- VALUES ('YOUR_SUPABASE_AUTH_USER_ID', 'admin@example.com', 'Admin Name', '1234567890', 'admin');

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================
-- View all registrations:
-- SELECT * FROM registrations ORDER BY created_at DESC;

-- Get statistics:
-- SELECT 
--     COUNT(*) as total_registrations,
--     COUNT(*) FILTER (WHERE registration_status = 'confirmed') as confirmed,
--     COUNT(*) FILTER (WHERE payment_status = 'completed') as paid
-- FROM registrations;

-- Get all users by role:
-- SELECT * FROM user_profiles WHERE role = 'team';
-- SELECT * FROM user_profiles WHERE role = 'admin';
