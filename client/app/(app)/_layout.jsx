import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import TabBars from '../../components/tabBars';
import HomeHeader from '../../components/HomeHeader';
import CardHeader from '../../components/CardHeader';
import HistoryHeader from '../../components/HistoryHeader';
import BillsHeader from '../../components/BillsHeader';
import ProfileHeader from '../../components/ProfileHeader';
import { useAuth } from '../../context/AuthContext';
import AccountHeader from '../../components/AccountHeader';
import KycHeader from '../../components/KycHeader';
import SavedCardHeader from '../../components/SavedCardHeader';

export default function _layout() {
  const { user } = useAuth();
  const router = useRouter()

  return (
    <Tabs tabBar={(props) => <TabBars {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          header: () => false
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: "Card",
          header: () => <CardHeader user={user} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          header: () => <HistoryHeader user={user} />,
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          header: () => <BillsHeader user={user} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          header: () => <ProfileHeader user={user} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          header: () => <AccountHeader user={user} router={router}/>
        }}
      />
      <Tabs.Screen
        name="kycupdate"
        options={{
          title: "KYC",
          header: () => <KycHeader user={user} router={router}/>
        }}
      />
      <Tabs.Screen
        name="security"
        options={{
          title: "Security",
          header: () => false
        }}
      />
      <Tabs.Screen
        name="savedcard"
        options={{
          title: "Save card",
          header: () => <SavedCardHeader router={router}/>
        }}
      />
      <Tabs.Screen
        name="transferuser"
        options={{
          title: "Transfer",
          header: () => false
        }}
      />
    </Tabs>
  );
}
