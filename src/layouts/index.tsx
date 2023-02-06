export default function (props: any) {
  if (props.location.pathname === '/login') {
    return (
      <>
        <h2>hello</h2>
        {props.children}
      </>
    );
  }

  return <>{props.children}</>;
}
