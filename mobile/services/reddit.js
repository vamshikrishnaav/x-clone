export const getRedditTrends = async()=>{
    try {
        const res = await fetch(  "https://www.reddit.com/r/popular.json?limit=20")
        const json = await res.json()

        return json.data.children.map(post=>({
             topic:post.data.title,
             tweets: formatScore(post.data.score)
        }))
    } catch (error) {
        console.log("Reddit api Error:",error);
       return[] ;
    }
}

const formatScore = (num)=>{
  if(num>=1000000) return (num/1000000).toFixed(1) + "M";
  if (num>=1000) return (num/1000).toFixed(1) +'K';
  return num.toString();
}