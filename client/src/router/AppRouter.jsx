import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Auth } from '../pages/auth'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute from './AdminRoute'
import MainLayout from '../layouts/MainLayout'
import UserDashboard from '../pages/dashboard/UserDashboard'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
import AddCourt from '../pages/courts/AddCourt'
import Matches from '../pages/matches/Matches'
import MatchesTable from '../pages/matches/MatchesTable'
import Players from '../pages/players/Players'
import UserProfile from '../pages/profile/UserProfile'
import MatchPlayers from '../components/matches/MatchPlayers'
import MatchInviteAccept from '../components/matches/MatchInviteAccept'
import MatchDeclineInvite from '../components/matches/MatchDeclineInvite'
import ResetPassword from '../pages/auth/ResetPassword'
import MatchVote from '../pages/matches/MatchVote'
import EditMatch from '../pages/matches/EditMatch'
import TermsAndConditions from '../pages/auth/TermsAndConditions'

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<Auth />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />

          <Route path='/match/details/:matchId/accept' element={<MatchInviteAccept />} />
          <Route path='/match/details/:matchId/decline' element={<MatchDeclineInvite />} />
          <Route path='/auth/reset-password/:token' element={<ResetPassword />} />

          <Route element={<ProtectedRoute />}>

            <Route element={<MainLayout />}>

            <Route path='/' element={<Navigate to="/games" />} />

              {/* user routes */}
              <Route path='games' element={<UserDashboard />} />
              <Route path='vote' element={<MatchVote />} />
              <Route path='profile' element={<UserProfile />} />
              <Route path='match/details/:id' element={<MatchPlayers />} />
              {/* <Route path='matches/details/:id' element={<MatchPlayers />} /> */}

              {/* admin routes */}
              <Route path='admin' element={<AdminRoute />}>
                <Route index path='dashboard' element={<AdminDashboard />} />
                <Route path='add-court' element={<AddCourt />} />
                <Route path='matches' element={<Matches />} />
                <Route path='view-matches' element={<MatchesTable />} />
                <Route path='players' element={<Players />} />
                 <Route path='match/edit/:id' element={<EditMatch />} />
              </Route>
            </Route>
          </Route>


          {/* default */}
          <Route path='*' element={<Navigate to='/auth' />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default AppRouter
