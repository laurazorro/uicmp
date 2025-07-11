'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import PageTemplateLong from "../templates/PageTemplateLong";
import Password from '../organisms/Password';

export default function PasswordPage() {
  return (
    <PageTemplateLong>
      <Password />
    </PageTemplateLong>
  );
}
