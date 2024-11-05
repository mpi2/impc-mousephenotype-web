export default function webstatus() {
  return (
    <>
      Status OK:true
      <br />
    </>
  );
}

webstatus.getLayout = function getLayout(page) {
  return <>{page}</>;
};
