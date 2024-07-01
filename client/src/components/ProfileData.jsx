/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */
export const ProfileData = (props) => {
  console.log(props.graphData);
  return (
    <div id="profile-div">
      <p>
        <strong>Name: </strong> {props.graphData.displayName}
      </p>
      <p>
        <strong>Email: </strong> {props.graphData.mail}
      </p>
      <p>
        <strong>id: </strong> {props.graphData.id}
      </p>
      <p>
        <strong>Manager email: </strong> {`dbhaskar@microsoft.com`}
      </p>
    </div>
  );
};
