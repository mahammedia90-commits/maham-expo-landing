'use client';

import { useState } from 'react';
import { useLanguageStore } from '@/shared/store/useLanguageStore';
import { useContactForm } from '../hooks/useContact';
import {
  MailIcon,
  PhoneIcon,
  LocationIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from '@/shared/components/Icons';

export function ContactForm() {
  const { t, isRtl } = useLanguageStore();
  const contactMutation = useContactForm();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await contactMutation.mutateAsync(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact form submission failed:', error);
    }
  };

  const contactInfo = [
    {
      icon: MailIcon,
      label: t.contact.emailLabel,
      value: 'info@maham.com.sa',
      href: 'mailto:info@maham.com.sa',
    },
    {
      icon: PhoneIcon,
      label: t.contact.phoneLabel,
      value: '+966 XX XXX XXXX',
      href: 'tel:+966XXXXXXXX',
    },
    {
      icon: LocationIcon,
      label: t.contact.addressLabel,
      value: t.contact.address,
      href: '#',
    },
  ];

  const socialLinks = [
    { href: '#', icon: TwitterIcon, label: 'Twitter' },
    { href: '#', icon: InstagramIcon, label: 'Instagram' },
    { href: '#', icon: LinkedInIcon, label: 'LinkedIn' },
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {t.contact.formTitle}
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-600 font-medium text-lg">{t.contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.contact.name} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t.contact.email} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {t.contact.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                        isRtl ? 'text-right' : 'text-left'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.contact.subject} *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t.contact.message} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e5f74] focus:border-transparent outline-none transition resize-none ${
                      isRtl ? 'text-right' : 'text-left'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full btn-primary text-white py-3 md:py-4 rounded-lg font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactMutation.isPending ? t.contact.sending : t.contact.send}
                </button>

                {contactMutation.isError && (
                  <p className="text-red-500 text-sm text-center">{t.contact.errorMessage}</p>
                )}
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              {t.contact.contactInfo}
            </h2>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="w-12 h-12 bg-[#1e5f74]/10 rounded-lg flex items-center justify-center text-[#1e5f74] flex-shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="text-gray-800 font-medium">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">{t.contact.followUs}</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-12 h-12 bg-[#1e5f74] rounded-lg flex items-center justify-center text-white hover:bg-[#133b5c] transition"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
