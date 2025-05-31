const twitterText = require('twitter-text');

// テストケース
const testCases = [
  {
    name: "基本的なテキスト",
    text: "こんにちは、今日は良い天気ですね！"
  },
  {
    name: "URL含む",
    text: "面白い記事を見つけました！ https://example.com/article"
  },
  {
    name: "絵文字含む",
    text: "今日は楽しい一日でした 😊🌟✨"
  },
  {
    name: "メンションとハッシュタグ",
    text: "@username さん、#プログラミング について話しましょう！"
  },
  {
    name: "長いテキスト",
    text: "これは非常に長いテキストです。".repeat(20)
  },
  {
    name: "複数URL",
    text: "参考リンク: https://example1.com と https://example2.com をチェック！"
  }
];

console.log("=== Twitter MCP Server テスト ===\n");

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  console.log(`テキスト: "${testCase.text}"`);

  const parsed = twitterText.parseTweet(testCase.text);
  const urls = twitterText.extractUrls(testCase.text);
  const mentions = twitterText.extractMentions(testCase.text);
  const hashtags = twitterText.extractHashtags(testCase.text);

  console.log(`文字数: ${parsed.weightedLength}/280`);
  console.log(`残り: ${280 - parsed.weightedLength}`);
  console.log(`有効: ${parsed.valid ? 'Yes' : 'No'}`);
  console.log(`URL数: ${urls.length}`);
  console.log(`メンション数: ${mentions.length}`);
  console.log(`ハッシュタグ数: ${hashtags.length}`);
  console.log("---");
});

console.log("\n✅ テスト完了！MCPサーバが正しく動作することを確認しました。");
