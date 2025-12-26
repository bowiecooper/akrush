"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitApplication } from "./actions";
import { createClient } from '@/lib/supabase/client';

type SubmitApplicationFormProps = {
  userId: string;
};

export default function SubmitApplicationForm({ userId }: SubmitApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [academicYearOther, setAcademicYearOther] = useState(false);
  const [genderOther, setGenderOther] = useState(false);
  const [majorOther, setMajorOther] = useState(false);
  const [major2Other, setMajor2Other] = useState(false);
  const [minorOther, setMinorOther] = useState(false);
  const [businessInterestOther, setBusinessInterestOther] = useState(false);
  const [whyAkpsiWordCount, setWhyAkpsiWordCount] = useState(0);
  const [q1WordCount, setQ1WordCount] = useState(0);
  const [q2WordCount, setQ2WordCount] = useState(0);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Helper function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Handler for Why AKPsi Response
  const handleWhyAkpsiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const wordCount = countWords(text);
    
    if (wordCount > 150) {
      // Prevent further input by truncating to the last valid position
      const words = text.trim().split(/\s+/);
      const validWords = words.slice(0, 150);
      e.target.value = validWords.join(' ');
      setWhyAkpsiWordCount(150);
    } else {
      setWhyAkpsiWordCount(wordCount);
    }
  };

  // Handler for Q1 Response
  const handleQ1Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const wordCount = countWords(text);
    
    if (wordCount > 150) {
      // Prevent further input by truncating to the last valid position
      const words = text.trim().split(/\s+/);
      const validWords = words.slice(0, 150);
      e.target.value = validWords.join(' ');
      setQ1WordCount(150);
    } else {
      setQ1WordCount(wordCount);
    }
  };

  // Handler for Q2 Response
  const handleQ2Change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const wordCount = countWords(text);
    
    if (wordCount > 250) {
      // Prevent further input by truncating to the last valid position
      const words = text.trim().split(/\s+/);
      const validWords = words.slice(0, 250);
      e.target.value = validWords.join(' ');
      setQ2WordCount(250);
    } else {
      setQ2WordCount(wordCount);
    }
  };
  
  // Refs for radio buttons to allow deselecting
  const major2RadioRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const minorRadioRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const deselectMajor2 = () => {
    Object.values(major2RadioRefs.current).forEach(ref => {
      if (ref) ref.checked = false;
    });
    setMajor2Other(false);
  };
  
  const deselectMinor = () => {
    Object.values(minorRadioRefs.current).forEach(ref => {
      if (ref) ref.checked = false;
    });
    setMinorOther(false);
  };

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    e.target.value = formatted;
  };

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setResumeUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select a file to upload.');
      }

      const file = event.target.files[0];
      
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        setResumeUploading(false);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Resume must be smaller than 10MB');
        setResumeUploading(false);
        return;
      }

      // Create unique filename with timestamp to avoid caching issues
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const filePath = `${userId}/resume_${timestamp}.${fileExt}`

      // First, delete any existing resume files for this user
      const { data: existingFiles } = await supabase.storage
        .from('rushee_resumes')
        .list(userId, {
          search: 'resume'
        })

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`)
        await supabase.storage
          .from('rushee_resumes')
          .remove(filesToDelete)
      }

      // Upload new file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('rushee_resumes')
        .upload(filePath, file, { upsert: false })

      if (uploadError) throw uploadError

      // Get public URL with cache-busting parameter
      const { data: { publicUrl } } = supabase.storage
        .from('rushee_resumes')
        .getPublicUrl(filePath)

      // Add cache-busting parameter
      const urlWithCacheBust = `${publicUrl}?t=${timestamp}`

      setResumeUrl(urlWithCacheBust)

    } catch (error) {
      alert('Error uploading resume: ' + (error as Error).message)
    } finally {
      setResumeUploading(false)
    }
  };

  const handleResumeDelete = async () => {
    if (!resumeUrl) return;
    
    if (!confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    try {
      setResumeUploading(true);

      // Extract file path from URL to delete from storage (remove cache-busting parameter if present)
      const urlWithoutParams = resumeUrl.split('?')[0] // Remove query parameters
      const urlParts = urlWithoutParams.split('/rushee_resumes/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('rushee_resumes')
          .remove([filePath])

        if (storageError) throw storageError
      }
      
      // Also clean up any other resume files for this user
      const { data: existingFiles } = await supabase.storage
        .from('rushee_resumes')
        .list(userId, {
          search: 'resume'
        })

      if (existingFiles && existingFiles.length > 0) {
        const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`)
        await supabase.storage
          .from('rushee_resumes')
          .remove(filesToDelete)
      }

      setResumeUrl(null)
      if (resumeInputRef.current) {
        resumeInputRef.current.value = '';
      }

    } catch (error) {
      // Error deleting resume - silently fail
    } finally {
      setResumeUploading(false)
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    // Add resume URL to form data if it exists
    if (resumeUrl) {
      formData.append('rushee_resume_url', resumeUrl);
    }
    
    const result = await submitApplication(formData);
    
    if (result?.error) {
      setIsSubmitting(false);
    } else {
      router.push("/rush/status");
    }
  };

  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          SUBMIT APPLICATION
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form action={handleSubmit} className="space-y-6">
            <p className="text-black mb-6 text-center">
              Fill out and submit your rush application. Applications are due January 22.
            </p>

            <div className="space-y-6">
              {/* Uniqname */}
              <div>
                <label htmlFor="rushee_uniqname" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Uniqname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_uniqname"
                  name="rushee_uniqname"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your uniqname"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_academic_year"
                      value="FRESHMAN"
                      required
                      onChange={() => setAcademicYearOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Freshman</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_academic_year"
                      value="SOPHOMORE"
                      required
                      onChange={() => setAcademicYearOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Sophomore</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_academic_year"
                      value="OTHER"
                      onChange={() => setAcademicYearOther(true)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {academicYearOther && (
                    <input
                      type="text"
                      name="rushee_academic_year_other"
                      placeholder="Specify other academic year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                    />
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="rushee_phone_number" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_phone_number"
                  name="rushee_phone_number"
                  required
                  maxLength={12}
                  onChange={handlePhoneChange}
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="xxx-xxx-xxxx"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="rushee_address" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Winter 2026 Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_address"
                  name="rushee_address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your address"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="MALE"
                      required
                      onChange={() => setGenderOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Male</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="FEMALE"
                      required
                      onChange={() => setGenderOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Female</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="NON_BINARY"
                      required
                      onChange={() => setGenderOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Non-Binary</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="PREFER_NOT"
                      required
                      onChange={() => setGenderOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Prefer not to say</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="OTHER"
                      onChange={() => setGenderOther(true)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {genderOther && (
                    <input
                      type="text"
                      name="gender_other"
                      placeholder="Specify other gender"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                    />
                  )}
                </div>
              </div>

              {/* Previously Rushed */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Have you previously rushed? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_previously_rushed"
                      value="true"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_previously_rushed"
                      value="false"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">No</span>
                  </label>
                </div>
              </div>

              {/* High School */}
              <div>
                <label htmlFor="rushee_high_school" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  High School <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_high_school"
                  name="rushee_high_school"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your high school name"
                />
              </div>

              {/* High School City */}
              <div>
                <label htmlFor="rushee_hs_city" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  High School City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_hs_city"
                  name="rushee_hs_city"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter city"
                />
              </div>

              {/* High School State */}
              <div>
                <label htmlFor="rushee_hs_state" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  High School State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="rushee_hs_state"
                  name="rushee_hs_state"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter state"
                />
              </div>

              {/* High School Graduation Year */}
              <div>
                <label htmlFor="rushee_hs_grad_year" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  High School Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="rushee_hs_grad_year"
                  name="rushee_hs_grad_year"
                  required
                  min="2000"
                  max="2050"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="2000-2050"
                />
              </div>

              {/* Major */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Major <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-1">
                  You MUST select Business Administration in this field if you are in Ross.
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  Select "Pre-Med" you are on a pre-med track and pursuing a related major, e.g. Biology, Neuroscience, BCN, etc.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="BUSINESS_ADMINISTRATION"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Business Administration</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="ECONOMICS"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Economics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="PUBLIC_POLICY"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Public Policy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="POLITICAL_SCIENCE"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Political Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="PSYCHOLOGY"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Psychology</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="PRE_MED"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Pre-Med</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="COMPUTER_SCIENCE"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="COMPUTER_ENGINEERING"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Engineering</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="DATA_SCIENCE"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Data Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="UI_UX"
                      required
                      onChange={() => setMajorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">UI/UX</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major"
                      value="OTHER"
                      required
                      onChange={() => setMajorOther(true)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {majorOther && (
                    <input
                      type="text"
                      name="rushee_major_other"
                      placeholder="Specify other major"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                    />
                  )}
                </div>
              </div>

              {/* 2nd Major */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xl font-bold text-[#4D84C6] block">
                    2nd Major
                  </label>
                  <button
                    type="button"
                    onClick={deselectMajor2}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Deselect
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Select "Pre-Med" you are on a pre-med track and pursuing a related major, e.g. Biology, Neuroscience, BCN, etc.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="ECONOMICS"
                      ref={(el) => { major2RadioRefs.current['ECONOMICS'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Economics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="PUBLIC_POLICY"
                      ref={(el) => { major2RadioRefs.current['PUBLIC_POLICY'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Public Policy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="POLITICAL_SCIENCE"
                      ref={(el) => { major2RadioRefs.current['POLITICAL_SCIENCE'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Political Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="PSYCHOLOGY"
                      ref={(el) => { major2RadioRefs.current['PSYCHOLOGY'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Psychology</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="PRE_MED"
                      ref={(el) => { major2RadioRefs.current['PRE_MED'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Pre-Med</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="COMPUTER_SCIENCE"
                      ref={(el) => { major2RadioRefs.current['COMPUTER_SCIENCE'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="COMPUTER_ENGINEERING"
                      ref={(el) => { major2RadioRefs.current['COMPUTER_ENGINEERING'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Engineering</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="DATA_SCIENCE"
                      ref={(el) => { major2RadioRefs.current['DATA_SCIENCE'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Data Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="UI_UX"
                      ref={(el) => { major2RadioRefs.current['UI_UX'] = el; }}
                      onChange={() => setMajor2Other(false)}
                      className="mr-2"
                    />
                    <span className="text-black">UI/UX</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_major2"
                      value="OTHER"
                      ref={(el) => { major2RadioRefs.current['OTHER'] = el; }}
                      onChange={() => setMajor2Other(true)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {major2Other && (
                    <input
                      type="text"
                      name="rushee_major2_other"
                      placeholder="Specify other major"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                    />
                  )}
                </div>
              </div>

              {/* Minor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xl font-bold text-[#4D84C6] block">
                    Minor
                  </label>
                  <button
                    type="button"
                    onClick={deselectMinor}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    Deselect
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Select "Pre-Med" you are on a pre-med track and pursuing a related major, e.g. Biology, Neuroscience, BCN, etc.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="BUSINESS_ADMINISTRATION"
                      ref={(el) => { minorRadioRefs.current['BUSINESS_ADMINISTRATION'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Business Administration</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="ECONOMICS"
                      ref={(el) => { minorRadioRefs.current['ECONOMICS'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Economics</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="PUBLIC_POLICY"
                      ref={(el) => { minorRadioRefs.current['PUBLIC_POLICY'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Public Policy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="POLITICAL_SCIENCE"
                      ref={(el) => { minorRadioRefs.current['POLITICAL_SCIENCE'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Political Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="PSYCHOLOGY"
                      ref={(el) => { minorRadioRefs.current['PSYCHOLOGY'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Psychology</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="PRE_MED"
                      ref={(el) => { minorRadioRefs.current['PRE_MED'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Pre-Med</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="COMPUTER_SCIENCE"
                      ref={(el) => { minorRadioRefs.current['COMPUTER_SCIENCE'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="COMPUTER_ENGINEERING"
                      ref={(el) => { minorRadioRefs.current['COMPUTER_ENGINEERING'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Computer Engineering</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="DATA_SCIENCE"
                      ref={(el) => { minorRadioRefs.current['DATA_SCIENCE'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">Data Science</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="UI_UX"
                      ref={(el) => { minorRadioRefs.current['UI_UX'] = el; }}
                      onChange={() => setMinorOther(false)}
                      className="mr-2"
                    />
                    <span className="text-black">UI/UX</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_minor"
                      value="OTHER"
                      ref={(el) => { minorRadioRefs.current['OTHER'] = el; }}
                      onChange={() => setMinorOther(true)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {minorOther && (
                    <input
                      type="text"
                      name="rushee_minor_other"
                      placeholder="Specify other minor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                    />
                  )}
                </div>
              </div>

              {/* Major 3 and Above */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rushee_major3andabove"
                    value="true"
                    className="mr-2"
                  />
                  <span className="text-black">I have more than 2 majors.</span>
                </label>
                <p className="text-sm text-gray-600 mt-1 ml-6">
                  We will reach out to you on a case-by-case basis.
                </p>
              </div>

              {/* Minor 2 and Above */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rushee_minor2andabove"
                    value="true"
                    className="mr-2"
                  />
                  <span className="text-black">I have more than 1 minor.</span>
                </label>
                <p className="text-sm text-gray-600 mt-1 ml-6">
                  We will reach out to you on a case-by-case basis.
                </p>
              </div>

              {/* College */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  College <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  You MUST select Ross School of Business in this field if you are in Ross.
                </p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="ROSS"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Ross School of Business</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="LSA"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">LSA</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="COE"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">College of Engineering</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="UMSI"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="DENT"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Dentistry</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="EDU"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Education</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="SEAS"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School for Environment and Sustainability</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="KINES"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Kinesiology</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="SMTD"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Music, Theatre, and Dance</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="NURS"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Nursing</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="PHAR"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">College of Pharmacy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="SPH"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Public Health</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="FORD"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Ford School of Public Policy</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="TAUB"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Taubman College of Architecture & Urban Planning</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="STAMPS"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">Stamps School of Art & Design</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rushee_college"
                      value="SSW"
                      required
                      className="mr-2"
                    />
                    <span className="text-black">School of Social Work</span>
                  </label>
                </div>
              </div>

              {/* Honors */}
              <div>
                <label htmlFor="rushee_honors" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Honors
                </label>
                <input
                  type="text"
                  id="rushee_honors"
                  name="rushee_honors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="e.g., Valedictorian, High School Football Captain"
                />
              </div>

              {/* Business Interest */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Business Interest
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="INVESTMENT_BANKING"
                      className="mr-2"
                    />
                    <span className="text-black">Investment Banking</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="PRIVATE_EQUITY"
                      className="mr-2"
                    />
                    <span className="text-black">Private Equity</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="CONSULTING"
                      className="mr-2"
                    />
                    <span className="text-black">Consulting</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="VENTURE_CAPITAL"
                      className="mr-2"
                    />
                    <span className="text-black">Venture Capital</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="REAL_ESTATE"
                      className="mr-2"
                    />
                    <span className="text-black">Real Estate</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="ENTREPRENEURSHIP"
                      className="mr-2"
                    />
                    <span className="text-black">Entrepreneurship</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="MARKETING"
                      className="mr-2"
                    />
                    <span className="text-black">Marketing</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="SUPPLY_CHAIN"
                      className="mr-2"
                    />
                    <span className="text-black">Supply Chain</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="WEALTH_ASSET_MANAGEMENT"
                      className="mr-2"
                    />
                    <span className="text-black">Wealth/Asset Management</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="FINANCE_OTHER"
                      className="mr-2"
                    />
                    <span className="text-black">Finance (Other)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="LAW"
                      className="mr-2"
                    />
                    <span className="text-black">Law</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="HEALTHCARE"
                      className="mr-2"
                    />
                    <span className="text-black">Healthcare</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="SUSTAINABILITY"
                      className="mr-2"
                    />
                    <span className="text-black">Sustainability</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="SOFTWARE_ENGINEERING"
                      className="mr-2"
                    />
                    <span className="text-black">Software Engineering</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="TRADING"
                      className="mr-2"
                    />
                    <span className="text-black">Trading</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="ENGINEERING_OTHER"
                      className="mr-2"
                    />
                    <span className="text-black">Engineering (Other)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rushee_business_interest"
                      value="OTHER"
                      onChange={(e) => setBusinessInterestOther(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-black">Other</span>
                  </label>
                  {businessInterestOther && (
                    <div>
                      <input
                        type="text"
                        name="rushee_business_interest_other"
                        placeholder="Specify other business interest"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        Please limit this entry, if applicable, to 5 words or less. Additionally, ensure that if you have multiple business interests, separate them by commas (e.g., "Data Science, Product Management").
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="text-xl font-bold text-[#4D84C6] block mb-2">
                  Resume Upload
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Please upload a PDF, DOC, or DOCX file.
                </p>
                <div className="space-y-2">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={resumeUploading}
                    ref={resumeInputRef}
                    className="hidden"
                  />

                  {/* Custom Choose File button */}
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={resumeUploading}
                    className="px-4 py-2 bg-[#4D84C6] text-white text-sm font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resumeUploading ? 'Uploading...' : resumeUrl ? 'Replace Resume' : 'Choose File'}
                  </button>

                  {/* Delete button - shown if resume exists */}
                  {resumeUrl && (
                    <button
                      type="button"
                      onClick={handleResumeDelete}
                      disabled={resumeUploading}
                      className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                    >
                      Delete Resume
                    </button>
                  )}

                  {/* Show uploaded resume status */}
                  {resumeUrl && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Resume uploaded successfully
                    </p>
                  )}
                </div>
              </div>

              {/* Why AKPsi Response */}
              <div>
                <label htmlFor="rushee_why_akpsi_response" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Why AKPsi Response <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Please limit your response to 150 words or less.
                </p>
                <textarea
                  id="rushee_why_akpsi_response"
                  name="rushee_why_akpsi_response"
                  rows={6}
                  required
                  onChange={handleWhyAkpsiChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your response"
                />
                <p className={`text-sm mt-1 ${whyAkpsiWordCount >= 150 ? 'text-red-500' : 'text-gray-600'}`}>
                  Word count: {Math.min(whyAkpsiWordCount, 150)} / 150
                </p>
              </div>

              {/* Q1 Response */}
              <div>
                <label htmlFor="rushee_q1_response" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Q1 Response <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Please limit your response to 150 words or less.
                </p>
                <textarea
                  id="rushee_q1_response"
                  name="rushee_q1_response"
                  rows={6}
                  required
                  onChange={handleQ1Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your response"
                />
                <p className={`text-sm mt-1 ${q1WordCount >= 150 ? 'text-red-500' : 'text-gray-600'}`}>
                  Word count: {Math.min(q1WordCount, 150)} / 150
                </p>
              </div>

              {/* Q2 Response */}
              <div>
                <label htmlFor="rushee_q2_response" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Q2 Response <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Please limit your response to 250 words or less.
                </p>
                <textarea
                  id="rushee_q2_response"
                  name="rushee_q2_response"
                  rows={6}
                  required
                  onChange={handleQ2Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter your response"
                />
                <p className={`text-sm mt-1 ${q2WordCount >= 250 ? 'text-red-500' : 'text-gray-600'}`}>
                  Word count: {Math.min(q2WordCount, 250)} / 250
                </p>
              </div>

              {/* Accommodations */}
              <div>
                <label htmlFor="rushee_accomodations" className="text-xl font-bold text-[#4D84C6] block mb-1">
                  Accommodations
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Let us know if there are any accommodations that we need to provide during the process.
                </p>
                <input
                  type="text"
                  id="rushee_accomodations"
                  name="rushee_accomodations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                  placeholder="Enter any accommodations needed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

