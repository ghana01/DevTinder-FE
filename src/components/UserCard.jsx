import React from 'react'

const UserCard = ({ user }) => {
  console.log("user card rendered", user);

  // Safety check
  if (!user) return null;

  const { firstName, lastName, photoUrl, age, gender, about } = user;

  return (
    <div className="card bg-blue-300 w-96 shadow-xl">
      <figure>
        <img
          src={photoUrl}
          alt="user photo"
          className="w-full h-60 object-cover object-top" 
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>
        {age && gender && <p>{age + ", " + gender}</p>}
        <p>{about}</p>
        
        <div className="card-actions justify-center my-4">
          <button className="btn btn-secondary">Ignore</button>
          <button className="btn btn-primary">Interested</button>
        </div>
      </div>
    </div>
  )
}

export default UserCard