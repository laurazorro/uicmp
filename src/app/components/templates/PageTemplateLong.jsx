'use client'
import Header from '../organisms/Header';
import LateralLayoutLong from '../organisms/LateralLayoutLong';

import PropTypes from 'prop-types';

export default function PageTemplateLong({ children }) {
  return (
    <>
      <Header />
      <LateralLayoutLong>{children}</LateralLayoutLong>
    </>
  );
}

PageTemplateLong.propTypes = {
  children: PropTypes.node.isRequired
};