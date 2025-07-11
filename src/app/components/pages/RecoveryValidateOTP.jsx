'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import PageTemplateLong from "../templates/PageTemplateLong";
import ValidateOTP from '../organisms/ValidateOTP';

export default function ValidateOTPPage() {
  return (
    <PageTemplateLong>
      <ValidateOTP />
    </PageTemplateLong>
  );
}
