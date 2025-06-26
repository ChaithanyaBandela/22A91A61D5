import { Log } from './utils/log'; 
import React, { useEffect } from 'react';


useEffect(() => {
  Log("frontend", "info", "component", "App mounted");
}, []);
