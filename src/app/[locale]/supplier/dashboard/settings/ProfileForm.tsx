'use client';

import { useState } from 'react';

type ProfileData = {
  company_name: string;
  description: string | null;
};

export function ProfileForm({ 
  initialData, 
  userEmail,
  labels 
}: { 
  initialData: ProfileData;
  userEmail: string;
  labels: {
    companyName: string;
    email: string;
    description: string;
    edit: string;
    save: string;
    cancel: string;
    saving: string;
  };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      const res = await fetch('/api/supplier/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setError('');
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '48px',
      }}>
        <h1 style={{
          fontFamily: 'EB Garamond, serif',
          fontSize: 'clamp(32px, 5vw, 48px)',
          color: 'rgba(255,255,255,0.95)',
          fontWeight: 400,
          margin: 0,
        }}>
          Профиль
        </h1>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              background: 'rgba(168,149,120,0.15)',
              border: '1px solid rgba(168,149,120,0.4)',
              padding: '10px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168,149,120,0.25)';
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(168,149,120,0.15)';
              e.currentTarget.style.borderColor = 'rgba(168,149,120,0.4)';
            }}
          >
            {labels.edit}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.6)',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '10px 20px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.5 : 1,
              }}
            >
              {labels.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.9)',
                background: 'rgba(168,149,120,0.25)',
                border: '1px solid rgba(168,149,120,0.6)',
                padding: '10px 20px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? labels.saving : labels.save}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,100,100,0.1)',
          border: '1px solid rgba(255,100,100,0.3)',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            color: 'rgba(255,150,150,0.9)',
            margin: 0,
          }}>
            {error}
          </p>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        {/* Имя компании */}
        <div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.5)',
            marginBottom: '12px',
          }}>
            {labels.companyName}
          </p>
          <div style={{
            borderBottom: '1px solid rgba(168,149,120,0.2)',
            paddingBottom: '16px',
          }}>
            {isEditing ? (
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                style={{
                  fontFamily: 'EB Garamond, serif',
                  fontSize: '36px',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 400,
                  background: 'rgba(168,149,120,0.05)',
                  border: '1px solid rgba(168,149,120,0.3)',
                  padding: '8px 12px',
                  width: '100%',
                  outline: 'none',
                  lineHeight: 1.2,
                }}
              />
            ) : (
              <p style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: '36px',
                color: 'rgba(255,255,255,0.95)',
                fontWeight: 400,
                margin: 0,
                lineHeight: 1.2,
              }}>
                {formData.company_name}
              </p>
            )}
          </div>
        </div>

        {/* Email (не редактируемый) */}
        <div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.5)',
            marginBottom: '12px',
          }}>
            {labels.email}
          </p>
          <div style={{
            borderBottom: '1px solid rgba(168,149,120,0.2)',
            paddingBottom: '16px',
          }}>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '18px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
              wordBreak: 'break-word',
            }}>
              {userEmail}
            </p>
          </div>
        </div>

        {/* Описание */}
        <div>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(168,149,120,0.5)',
            marginBottom: '12px',
          }}>
            {labels.description}
          </p>
          <div style={{
            borderBottom: '1px solid rgba(168,149,120,0.2)',
            paddingBottom: '16px',
          }}>
            {isEditing ? (
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.85)',
                  background: 'rgba(168,149,120,0.05)',
                  border: '1px solid rgba(168,149,120,0.3)',
                  padding: '12px',
                  width: '100%',
                  outline: 'none',
                  lineHeight: 1.8,
                  resize: 'vertical',
                }}
              />
            ) : (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                {formData.description || '—'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
