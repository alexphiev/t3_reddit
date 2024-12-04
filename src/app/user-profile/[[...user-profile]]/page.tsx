import { UserProfile } from '@clerk/nextjs'

const UserProfilePage = () => (
  <div
    style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
    }}
  >
    <UserProfile
      appearance={{
        elements: {
          rootBox: 'size-full',
          cardBox: 'size-full',
        },
      }}
    />
  </div>
)

export default UserProfilePage
