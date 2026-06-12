delete from translation_messages
where namespace = 'Home'
  and key in (
    'positioningHeadingStrong',
    'positioningHeadingRest',
    'positioningBody',
    'solutionsEyebrow',
    'contactHeading',
    'contactBody'
  );
