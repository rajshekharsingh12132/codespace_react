import React, { useState } from 'react';

const initialFormData = {
  username: '',
  email: '',
  address: '',
  city: '',
  zip: '',
};

const initialErrors = {
  username: '',
  email: '',
  address: '',
  city: '',
  zip: '',
};

const MultistepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);

  // Validate specific field on blur
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return value.trim() === '' ? 'Username is required' : '';
      case 'email':
        return value.includes('@') ? '' : 'Email must include "@"';
      default:
        return '';
    }
  };

  // Handle blur to validate on field exit
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Handle controlled input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error as user types (optional)
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Simple validation check before moving to next step
  const canProceed = () => {
    if (step === 1) {
      return (
        formData.username.trim() !== '' &&
        formData.email.includes('@') &&
        !errors.username &&
        !errors.email
      );
    }
    // For step 2, no required validation (can add if needed)
    return true;
  };

  // Next and Previous step handlers
  const nextStep = () => {
    if (canProceed()) setStep((prev) => Math.min(prev + 1, 2));
    else alert('Please fix errors before proceeding');
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Multi-step Form</h2>

      {step === 1 && (
        <div>
          <div>
            <label htmlFor="username">Username:</label><br />
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email">Email:</label><br />
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div>
            <label htmlFor="address">Address:</label><br />
            <input
              type="text"
              name="address"
              id="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="city">City:</label><br />
            <input
              type="text"
              name="city"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="zip">Zip Code:</label><br />
            <input
              type="text"
              name="zip"
              id="zip"
              value={formData.zip}
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {step > 1 && (
          <button type="button" onClick={prevStep} style={{ marginRight: 10 }}>
            Previous
          </button>
        )}

        {step < 2 && (
          <button type="button" onClick={nextStep}>
            Next
          </button>
        )}
      </div>

      <hr />

      <h3>Current Form Values</h3>
      <pre style={{ background: '#f4f4f4', padding: 10 }}>
        {JSON.stringify(formData, null, 2)}
      </pre>
    </div>
  );
};

export default MultistepForm;
