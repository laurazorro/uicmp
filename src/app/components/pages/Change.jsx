'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import PageTemplate from "../templates/PageTemplate";
import Change from '../organisms/Change';

export default function ChangePage() {
  return (
    <PageTemplate>
      <Change />
    </PageTemplate>
  );
}
