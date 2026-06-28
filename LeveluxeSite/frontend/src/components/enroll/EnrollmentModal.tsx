import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { enrollmentService, type EnrollmentPayload } from '../../services/enrollmentService';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
  defaultLevel?: string;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  isOpen,
  onClose,
  defaultCourse = '',
  defaultLevel = 'Beginner'
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    selectedCourse: '',
    experienceLevel: 'Beginner',
    preferredBatch: 'Morning Batch',
    message: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Pre-fill course and level if default parameters are provided when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        selectedCourse: defaultCourse,
        experienceLevel: defaultLevel || 'Beginner',
        preferredBatch: 'Morning Batch',
        message: ''
      });
      setValidationErrors({});
      setSubmitSuccess(false);
      setSubmitError(null);
    }
  }, [isOpen, defaultCourse, defaultLevel]);

  const courseOptions = [
    "Guitar (Acoustic & Electric)",
    "Piano (Classical & Modern)",
    "Keyboard (Synthesizer)",
    "Violin (Classical Repertoire)",
    "Drums & Percussion",
    "Vocal Music Training"
  ];

  const levelOptions = ["Beginner", "Intermediate", "Advanced"];
  const batchOptions = ["Morning Batch", "Afternoon Batch", "Evening Batch"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field starts changing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required.";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\+?[\d\s-]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errors.phone = "Please enter a valid phone number (at least 10 digits).";
    }
    
    const parsedAge = parseInt(formData.age);
    if (!formData.age) {
      errors.age = "Age is required.";
    } else if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      errors.age = "Please enter a valid age.";
    }
    
    if (!formData.selectedCourse) {
      errors.selectedCourse = "Please select a course.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: EnrollmentPayload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age),
      selected_course: formData.selectedCourse,
      experience_level: formData.experienceLevel,
      preferred_batch: formData.preferredBatch,
      message: formData.message || undefined
    };

    try {
      await enrollmentService.submitEnrollment(payload);
      setSubmitSuccess(true);
      // Clear form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        selectedCourse: '',
        experienceLevel: 'Beginner',
        preferredBatch: 'Morning Batch',
        message: ''
      });
    } catch (err: any) {
      console.error("Enrollment failed:", err);
      setSubmitError(
        err.response?.data?.detail || 
        "Failed to submit enrollment request. Please check if the backend API is running."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl z-10 text-left flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 id="modal-title" className="text-xl font-extrabold text-white">Enrollment Application</h3>
                <p className="text-xs text-neutral-450 mt-1">Book your slot and start your musical journey</p>
              </div>
              <button 
                onClick={onClose}
                className="text-neutral-450 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-grow space-y-6">
              
              {/* Success State */}
              {submitSuccess ? (
                <div className="text-center py-12 px-4 space-y-5">
                  <div className="inline-flex p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="h-12 w-12" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">Enrollment Request Saved!</h4>
                    <p className="text-sm text-neutral-450 max-w-xs mx-auto leading-relaxed">
                      Thank you for submitting! Our admission team will contact you shortly via phone or email to schedule your trial class.
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="bg-yellow-500 hover:bg-yellow-400 text-neutral-900 font-bold px-6 py-2.5 rounded-xl transition-all active:scale-95"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Submission Error Banner */}
                  {submitError && (
                    <div className="bg-red-950/25 border border-red-900/50 text-red-400 rounded-xl p-4 flex items-start space-x-3 text-xs">
                      <AlertCircle className="h-4.5 w-4.5 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <span className="font-bold">Submission Error</span>
                        <p>{submitError}</p>
                      </div>
                    </div>
                  )}

                  {/* Two-Column Personal Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="fullName" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Full Name *</label>
                      <input 
                        type="text" 
                        id="fullName" 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full bg-neutral-950 border ${validationErrors.fullName ? 'border-red-500' : 'border-neutral-800 focus:border-yellow-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none`}
                        placeholder="John Doe"
                      />
                      {validationErrors.fullName && <p className="text-[10px] text-red-400 font-medium">{validationErrors.fullName}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full bg-neutral-950 border ${validationErrors.email ? 'border-red-500' : 'border-neutral-800 focus:border-yellow-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none`}
                        placeholder="john@example.com"
                      />
                      {validationErrors.email && <p className="text-[10px] text-red-400 font-medium">{validationErrors.email}</p>}
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Phone Number *</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full bg-neutral-950 border ${validationErrors.phone ? 'border-red-500' : 'border-neutral-800 focus:border-yellow-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none`}
                        placeholder="+91 98765 43210"
                      />
                      {validationErrors.phone && <p className="text-[10px] text-red-400 font-medium">{validationErrors.phone}</p>}
                    </div>

                    {/* Student Age */}
                    <div className="space-y-1.5">
                      <label htmlFor="age" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Student Age *</label>
                      <input 
                        type="number" 
                        id="age" 
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className={`w-full bg-neutral-950 border ${validationErrors.age ? 'border-red-500' : 'border-neutral-800 focus:border-yellow-500'} rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none`}
                        placeholder="18"
                      />
                      {validationErrors.age && <p className="text-[10px] text-red-400 font-medium">{validationErrors.age}</p>}
                    </div>

                  </div>

                  {/* Course Dropdown */}
                  <div className="space-y-1.5">
                    <label htmlFor="selectedCourse" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Selected Course *</label>
                    <select 
                      id="selectedCourse" 
                      name="selectedCourse"
                      value={formData.selectedCourse}
                      onChange={handleInputChange}
                      className={`w-full bg-neutral-950 border ${validationErrors.selectedCourse ? 'border-red-500' : 'border-neutral-800 focus:border-yellow-500'} rounded-xl px-4 py-3 text-sm text-white focus:outline-none`}
                    >
                      <option value="" disabled>-- Select a Music Program --</option>
                      {courseOptions.map((c) => (
                        <option key={c} value={c} className="bg-neutral-900">{c}</option>
                      ))}
                    </select>
                    {validationErrors.selectedCourse && <p className="text-[10px] text-red-400 font-medium">{validationErrors.selectedCourse}</p>}
                  </div>

                  {/* Skill level and Batch timings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Experience Level */}
                    <div className="space-y-1.5">
                      <label htmlFor="experienceLevel" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Experience Level</label>
                      <select 
                        id="experienceLevel" 
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        {levelOptions.map((l) => (
                          <option key={l} value={l} className="bg-neutral-900">{l}</option>
                        ))}
                      </select>
                    </div>

                    {/* Preferred Batch */}
                    <div className="space-y-1.5">
                      <label htmlFor="preferredBatch" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Preferred Batch Slot</label>
                      <select 
                        id="preferredBatch" 
                        name="preferredBatch"
                        value={formData.preferredBatch}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                      >
                        {batchOptions.map((b) => (
                          <option key={b} value={b} className="bg-neutral-900">{b}</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Additional Message (Optional)</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-yellow-500 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none resize-none"
                      placeholder="Write notes about your music goals, instrument ownership, or queries..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-yellow-500/5 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="h-4.5 w-4.5 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>

                </form>
              )}

            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

export default EnrollmentModal;
