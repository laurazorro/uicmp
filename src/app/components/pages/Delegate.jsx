'use client'
import '@fontsource/montserrat';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';

import PageTemplate from "../templates/PageTemplate";
import Delegate from '../organisms/Delegate';

export default function DelegatePage() {
  return (
    <PageTemplate>
      <Delegate />
    </PageTemplate>
  );
}
