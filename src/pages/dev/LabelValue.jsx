import React from 'react'

const LabelValue = ({label, value}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <span>{label}:</span>
      <span style={{ color: 'crimson' }}>{value}</span>
    </div>
  );
}

export default LabelValue
