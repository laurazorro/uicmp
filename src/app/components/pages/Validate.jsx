'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import PageTemplate from "../templates/PageTemplate";
import Validate from '../organisms/Validate';

export default function ValidatePage() {
  return (
    <PageTemplate>
      <Validate />
    </PageTemplate>
  );
}
