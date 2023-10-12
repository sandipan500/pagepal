import React from 'react';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const Dashboard = () => {
  const {getUser} = getKindeServerSession();
  const user = getUser();

  return (
    <div>Dashboard</div>
  )
};

export default Dashboard;