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
  let result_SPLIT = {};
  for (let i = 0; i < allItems.length; i++) {
    let data_list = allItems[i].hometown.split("——deta数据分割线——");
    result_SPLIT[allItems[i].name] = data_list; //切割，每个列表都加到另一个列表里
  }
  console.debug("[SPLIT]数据切割完成");
  //console.debug(result_SPLIT)
  return result_SPLIT;
}

//写入页面函数
function Display(Display_data) {
  let searchParams = new URLSearchParams(location.search);
  let Display_article_data = searchParams.get("title");
  console.debug("[Article]开始写入页面");
  console.log(Display_data[Display_article_data]);
  //写入部分
  const ArticleList = document.getElementById("Article");
  let ArticleHtml = "";
  //文章
  ArticleHtml += `

<div class="rin-card-article">
    <div class="rin-article-title">${Display_article_data}</div>
    <div class="rin-article-content">${Display_data[Display_article_data][1]}</div>
</div>
            `;
  ArticleList.innerHTML += ArticleHtml;

  // 开启代码高亮
  hljs.initHighlightingOnLoad();
  // 行号显示
  //hljs.initLineNumbersOnLoad({ singleLine: true });
  console.debug("[Article]完成写入");
}

let searchParams = new URLSearchParams(location.search);

if (searchParams.get("title") !== null) {
  console.log(searchParams.get("title"));
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
      Display(SPLIT());
    })
    .catch((error) => console.error(error));
} else {
  console.error("[ArtDisplay]未获得文章参数");
}
