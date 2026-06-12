delete from translation_messages
where namespace = 'AboutPage'
  and key in ('missionP1', 'missionP2', 'missionP3');

delete from translation_messages
where namespace = 'SolutionsPage'
  and key in ('integratedP1', 'integratedP2');
