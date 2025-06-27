import { styled, Box } from "@mui/material";
import type { FC } from "react";
import DatePicker from "react-datepicker";

const CalendarContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  padding: '20px 60px',
  flexWrap: 'wrap',
  '& .react-datepicker': {
    border: 'none',
    overflow: 'hidden',
  },
  '& .react-datepicker__header': {
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e9ecef',
    padding: '12px 0'
  },
  '& .react-datepicker__current-month': {
    color: '#3a3a3a',
    fontWeight: 500,
    fontSize: '1rem'
  },
  '& .react-datepicker__day-names': {
    marginTop: '8px'
  },
  '& .react-datepicker__day-name': {
    color: '#6c757d',
    fontWeight: 500,
    width: '36px',
    lineHeight: '36px',
    margin: '0 2px'
  },
  '& .react-datepicker__month': {
    margin: '8px'
  },
  '& .react-datepicker__day': {
    width: '36px',
    height: '36px',
    lineHeight: '36px',
    borderRadius: '50%',
    margin: '2px',
    '&:hover': {
      backgroundColor: '#e9ecef'
    }
  },
  '& .react-datepicker__day--selected': {
    backgroundColor: '#1976d2',
    
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  '& .react-datepicker__day--in-range': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  '& .react-datepicker__day--in-selecting-range': {
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  },
  '& .react-datepicker__day--today': {
    fontWeight: 'bold',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '4px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '6px',
      height: '6px',
      backgroundColor: '#1976d2',
      borderRadius: '50%'
    }
  }
});
 

interface CalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  handleDateChange: (dates: [Date | null, Date | null]) => void;
}


export const Calendar: FC<CalendarProps> = ({
  startDate,
  endDate,
  handleDateChange,
}) => {
    return (
         <CalendarContainer>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            locale="ru"
            minDate={new Date()}
            dateFormat="dd.MM.yyyy"
            isClearable
          />
        </CalendarContainer>
    )
}