'use client'
import Header from '../organisms/Header';
import LateralLayout from '../organisms/LateralLayout';

import PropTypes from 'prop-types';

export default function PageTemplate({ children }) {
  return (
    <>
      <Header />
      <LateralLayout>{children}</LateralLayout>
    </>
  );
}

PageTemplate.propTypes = {
  children: PropTypes.node.isRequired
};