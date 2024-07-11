import useFetch from "../../hooks/useFetch";
import "./featured.css";

const Featured = () => {
  const { data, loading, error } = useFetch(
    "/hotels/countByCity?cities=Colombo,Kandy,Trincomalee"
  );

  if (loading) {
    return <div className="featured">Loading please wait...</div>;
  }

  if (error) {
    return <div className="featured">Error: {error.message}</div>;
  }

  return (
    <div className="featured">
      <div className="featuredItem">
        <img
          src="https://www.ugaescapes.com/wp-content/uploads/2018/06/colombo-mobile.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Colombo</h1>
          <h2>{data[0]} properties</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://static.wixstatic.com/media/65f045_e4c0db99c4294f6194d270687add03f6~mv2.jpg/v1/crop/x_0,y_51,w_1105,h_469/fill/w_1105,h_469,al_c,q_85,enc_auto/kandy_polwaththa_srilanka_jpeg.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Kandy</h1>
          <h2>{data[1]} properties</h2>
        </div>
      </div>

      <div className="featuredItem">
        <img
          src="https://digitaltravelcouple.com/wp-content/uploads/2019/09/fernandos-bar-trincomalee-1024x683.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1>Trincomalee</h1>
          <h2>{data[2]} properties</h2>
        </div>
      </div>
    </div>
  );
};

export default Featured;
