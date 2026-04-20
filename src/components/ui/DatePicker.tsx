'use client';

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@/context/ThemeContext';

interface CustomDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

const limeColors = {
  50: '#f7fee7',
  100: '#ecfccb',
  200: '#d9f99d',
  300: '#bef264',
  400: '#a3e635',
  500: '#84cc16',
  600: '#65a30d',
  700: '#4d7c0f',
  800: '#3f6212',
  900: '#365314',
};

export default function CustomDatePicker({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
  fullWidth = true,
}: CustomDatePickerProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format('YYYY-MM-DD'));
    } else {
      onChange('');
    }
  };

  return (
    <DatePicker
      label={label}
      value={value ? dayjs(value) : null}
      onChange={handleChange}
      slotProps={{
        textField: {
          required,
          fullWidth,
          error,
          helperText,
          sx: {
            '& .MuiOutlinedInput-root': {
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              '& fieldset': {
                borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)',
                borderWidth: '1.5px',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'rgba(132, 204, 22, 0.4)' : 'rgba(132, 204, 22, 0.3)',
              },
              '&.Mui-focused fieldset': {
                borderColor: limeColors[500],
                borderWidth: '2px',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#a1a1aa' : '#71717a',
              fontWeight: 500,
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: limeColors[500],
            },
            '& .MuiInputBase-input': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#a1a1aa' : '#71717a',
            },
            '& .MuiFormHelperText-root.Mui-error': {
              color: '#ef4444',
            },
          },
        },
        popper: {
          sx: {
            '& .MuiPaper-root': {
              borderRadius: '16px',
              bgcolor: isDarkMode ? '#18181b' : '#ffffff',
              backgroundImage: 'none',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            '& .MuiPickersDay-root': {
              borderRadius: '8px',
              '&.Mui-selected': {
                bgcolor: limeColors[500],
                '&:hover': {
                  bgcolor: limeColors[600],
                },
              },
            },
            '& .MuiPickersDay-today': {
              borderColor: limeColors[500],
            },
            '& .MuiPickersCalendarHeader-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
            '& .MuiDayCalendar-header': {
              '& .MuiTypography-root': {
                color: isDarkMode ? '#a1a1aa' : 'inherit',
              },
            },
            '& .MuiIconButton-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
          },
        },
      }}
    />
  );
}
