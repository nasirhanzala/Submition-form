import { useState, useEffect, useRef } from "react";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef(null);

  // Profile photo preview
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Typing shuru karte hi us field ka error hat jaye
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0] || null);
    if (errors.image) setErrors({ ...errors, image: undefined });
  };

  const removeImage = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const newErrors = {};

    if (form.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address.";

    if (!/^\+?[0-9\s-]{10,15}$/.test(form.phone))
      newErrors.phone = "Enter a valid phone number.";

    if (!form.dob || form.dob >= new Date().toISOString().split("T")[0])
      newErrors.dob = "Select a valid date of birth.";

    if (!form.gender)
      newErrors.gender = "Please select your gender.";

    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    if (form.confirmPassword !== form.password || !form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (!image) {
      newErrors.image = "Please upload a profile picture.";
    } else if (
      !["image/jpeg", "image/png", "image/webp"].includes(image.type)
    ) {
      newErrors.image = "Only JPG, PNG and WEBP are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  const errorInput = "!border-red-500 !bg-red-50/40 focus:!ring-red-100";

  const fields = [
    { label: "Full Name", name: "name", type: "text", placeholder: "Enter your full name" },
    { label: "Email Address", name: "email", type: "email", placeholder: "example@email.com" },
    { label: "Phone Number", name: "phone", type: "tel", placeholder: "+92 300 1234567" },
    { label: "Date of Birth", name: "dob", type: "date" },
    { label: "Password", name: "password", type: "password", placeholder: "Minimum 8 characters" },
    { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Re-enter password" },
  ];

  // Error message with small icon
  const ErrorText = ({ message }) =>
    message ? (
      <p className="error-in mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 6a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V6zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            clipRule="evenodd"
          />
        </svg>
        {message}
      </p>
    ) : null;

  const EyeIcon = ({ off }) => (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {off ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  const renderField = (field) => {
    const isPassword = field.type === "password";
    const visible = field.name === "password" ? showPassword : showConfirm;
    const toggle = () =>
      field.name === "password"
        ? setShowPassword((v) => !v)
        : setShowConfirm((v) => !v);

    return (
      <div key={field.name}>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          {field.label} *
        </label>
        <div className="relative">
          <input
            className={`${inputClass} ${errors[field.name] ? errorInput : ""} ${isPassword ? "pr-12" : ""}`}
            name={field.name}
            type={isPassword ? (visible ? "text" : "password") : field.type}
            placeholder={field.placeholder}
            value={form[field.name]}
            onChange={handleChange}
          />
          {isPassword && (
            <button
              type="button"
              onClick={toggle}
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 transition hover:text-slate-700"
            >
              <EyeIcon off={visible} />
            </button>
          )}
        </div>
        <ErrorText message={errors[field.name]} />
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-12">
      <style>{`
        @keyframes errorIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: translateY(16px) scale(.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes checkIn { from { transform: scale(.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .error-in { animation: errorIn .2s ease-out; }
        .fade-in { animation: fadeIn .2s ease-out; }
        .pop-in { animation: popIn .3s cubic-bezier(.16,1,.3,1); }
        .check-in { animation: checkIn .4s .1s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-xl sm:p-10">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
            👤
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Create Your Account
          </h1>
          <p className="mt-2 text-slate-500">
            Fill in your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">

            {fields.slice(0, 4).map(renderField)}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Gender *
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={`${inputClass} ${errors.gender ? errorInput : ""}`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <ErrorText message={errors.gender} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Profile Picture *
              </label>

              <div
                className={`flex items-center gap-3 rounded-xl border p-2.5 ${
                  errors.image ? "border-red-500 bg-red-50/40" : "border-slate-200"
                }`}
              >
                {/* Photo preview */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-xl">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <input
                  ref={fileRef}
                  id="profile-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  className="hidden"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="profile-image"
                      className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {image ? "Change" : "Choose photo"}
                    </label>
                    {image && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="text-sm font-semibold text-slate-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="truncate text-xs text-slate-400">
                    {image ? image.name : "JPG, PNG or WEBP"}
                  </p>
                </div>
              </div>
              <ErrorText message={errors.image} />
            </div>

            {fields.slice(4).map(renderField)}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : "Create Account"}
          </button>
        </form>
      </div>

      {success && (
        <div
          className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
          onClick={() => setSuccess(false)}
        >
          <div
            className="pop-in w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="check-in mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600 ring-8 ring-green-50">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Registration Successful!
            </h2>
            <p className="mt-3 text-slate-500">
              Your form has been submitted successfully.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;

