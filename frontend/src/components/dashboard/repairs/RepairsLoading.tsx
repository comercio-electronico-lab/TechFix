"use client";

import React from 'react';

const RepairsLoading = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900 border border-outline-variant/60 dark:border-slate-800 p-12 text-center rounded-3xl">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary mx-auto"></div>
    </div>
  );
};

export default RepairsLoading;
