//总体思路为：网页打开后先获取所有文章数据，写好跳转按钮等内容，文章内容在按钮触发后再进行写入
var JsonData;

//文章切割函数
function SPLIT() {
  console.debug("[SPLIT]数据切割开始");
  /*以下是上传的数据结构
  UploadData = '——deta数据分割线——'.join([article.summary, article.content, str(article.data_id), str(article.author.id), str(article.due_modify), str(article.due_release), article.remark,
    str(article.author.id), article.author.first_name, article.author.last_name, article.author.GithubURL, article.CloudDataBase_genre_name()])
Tip：这里将文章标题插入到首项中
    */
  let allItems = JsonData.items;
  let result_SPLIT = [];
  for (let i = 0; i < allItems.length; i++) {
    let data_list = allItems[i].hometown.split("——deta数据分割线——");
    data_list.unshift(allItems[i].name);
    result_SPLIT.push(data_list); //切割，每个列表都加到另一个列表里
  }
  console.debug("[SPLIT]数据切割完成");
  //console.debug(result_SPLIT)
  return result_SPLIT.sort((a, b) => {
    const timeA = new Date(a[5]).getTime(); //将字符串转为时间戳
    const timeB = new Date(b[5]).getTime(); //将字符串转为时间戳
    return timeB - timeA; //倒序排列
  });
}

//按照类型将文章分类存储至字典中
function Classify_Genre(SPLIT_Data) {
  console.debug("[Classify_Genre]数据开始按类型分类");
  var SPLIT_Data = SPLIT_Data;
  //console.log(SPLIT_Data);
  let result_Classify_Genre = {};
  for (let i = 0; i < SPLIT_Data.length; i++) {
    //遍历文章
    var Article_Genre = SPLIT_Data[i][12].split("丨"); //在js中如果list[-1]会返回undefined
    console.log(Article_Genre);
    console.log(Object.keys(result_Classify_Genre));
    for (let j = 0; j < Article_Genre.length; j++) {
      if (
        Object.keys(result_Classify_Genre).includes(Article_Genre[j]) === true
      ) {
        //如果该类型在存储字典的key中
        console.log(Object.keys(result_Classify_Genre));
        result_Classify_Genre[Article_Genre[j]].push(SPLIT_Data[i]);
      } else {
        //否则创建新的
        result_Classify_Genre[Article_Genre[j]] = []; //创建新key
        result_Classify_Genre[Article_Genre[j]].push(SPLIT_Data[i]);
      }
    }
  }
  console.debug(
    "[Classify_Genre]数据已按类型分类，共有" +
      Object.keys(result_Classify_Genre).length +
      "个类型"
  );
  //console.log(result_Classify_Genre)
  return result_Classify_Genre;
}

//写入页面函数
function Display(Display_data) {
  let searchParams = new URLSearchParams(location.search);
  let Display_article_data = searchParams.get("genre");
  console.debug("[Article]开始写入页面");
  console.log(Display_data[Display_article_data]);
  //写入部分
  const ArticleList = document.getElementById("Article-list");
  let ArticleHtml = "";
  for (let i = 0; i < Display_data[Display_article_data].length; i++) {
    ArticleHtml += `
            <a target="_blank" href="./article.html" id=${Display_data[Display_article_data][i][0]}>
                <div class="mdui-card rin-card rin-card-article" style="margin-bottom: 10px;">
                    <div class="rin-article-title">${Display_data[Display_article_data][i][0]}</div>
                    <div class="rin-article-content">${Display_data[Display_article_data][i][1]}</div>
                </div>
            </a>
            `;
  }
  ArticleList.innerHTML += ArticleHtml;
  console.debug("[Article]完成写入-1");

  for (let i = 0; i < Display_data[Display_article_data].length; i++) {
    let link = document.getElementById(
      Display_data[Display_article_data][i][0]
    ); // 获取链接元素
    link.addEventListener("click", function (event) {
      event.preventDefault(); // 阻止默认行为
      // 构造URL参数
      let params = new URLSearchParams();
      params.append("title", Display_data[Display_article_data][i][0]); //给文章列表传递文章类别
      // 跳转到目标页面并传递参数
      location.href = "./article.html?" + params.toString();
    });
  }
  console.debug("[Article]完成写入-2");
}

fetch("https://database.deta.sh/v1/c0z1mow5/MyBlog_Article/query", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "c0z1mow5_gD3yu1w4ybeJXXdtnUTxDRvpNMhfwFBL",
  },
})
  .then((response) => response.json())
  .then((data) => {
    JsonData = data;
    console.debug("[DisplayModel.js]数据获取成功");
    //console.log(JsonData);
    Display(Classify_Genre(SPLIT()));
  })
  .catch((error) => console.error(error));
