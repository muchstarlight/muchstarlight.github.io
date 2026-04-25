# Firefly 博客自定义待办清单

> 基于当前配置文件检查，以下是你还保留模板默认值或需要修改/确认的地方。
> 完成一项后请打勾，全部完成后可删除本文件。

---

## 🔴 高优先级（会显示错误内容或指向他人账户）

### 1. 修复移动端底部组件
- [ ] **文件**: `src/config/sidebarConfig.ts`（第 161–185 行）
- **问题**: 桌面端关闭了公告和音乐，但移动端底部两者都是 `enable: true`。
  - 公告内容还是模板默认的："欢迎来到我的博客！这是一则示例公告。"
  - 音乐播放器使用了未确认的歌单。
- **操作**（二选一）：
  - **方案 A**: 把移动端底部的 `announcement` 和 `music` 的 `enable` 改为 `false`。
  - **方案 B**: 去 `src/config/announcementConfig.ts` 写你自己的公告，并去 `src/config/musicConfig.ts` 确认歌单 ID 是你自己的。

### 2. 确认音乐播放器歌单 ID
- [ ] **文件**: `src/config/musicConfig.ts`（第 35 行）
- **问题**: 当前网易云歌单 ID 是 `10046455237`。
- **操作**: 登录网易云音乐，确认这个数字是否是你自己的歌单。如果不是，请替换或关闭音乐播放器。

---

## 🟡 中优先级（功能未启用但配置保留模板值）

### 3. 决定评论系统去留
- [ ] **文件**: `src/config/commentConfig.ts` + `src/config/siteConfig.ts`
- **问题**: `commentConfig.ts` 中 `type: "none"`，但留言板页面是开启的（`siteConfig.ts` 中 `guestbook: true`），导致留言板没有评论区。
- **操作**（二选一）：
  - **方案 A**: 开启评论 —— 把 `commentConfig.ts` 中的 `type` 改为 `"giscus"`（你的 Giscus 仓库信息已填好）。
  - **方案 B**: 关闭留言板 —— 把 `siteConfig.ts` 中的 `pages.guestbook` 改为 `false`。

### 4. 清理赞助配置
- [ ] **文件**: `src/config/sponsorConfig.ts`
- **问题**: 虽然赞助页面被关闭（`siteConfig.ts` 中 `sponsor: false`），但配置里全是模板作者（CuteLeaf）的信息：
  - ko-fi 链接: `https://ko-fi.com/cuteleaf`
  - 爱发电链接: `https://ifdian.net/a/cuteleaf`
  - 赞助者列表有示例数据: "夏叶 ¥50"、"匿名用户 ¥20"
- **操作**:
  - 如果以后不打算开启赞助页面：可暂时不管，但建议把链接改成你自己的以防误开。
  - 如果打算开启：把所有链接、描述、赞助者列表替换为你自己的信息。

### 5. 处理友链示例数据
- [ ] **文件**: `src/config/friendsConfig.ts`
- **问题**: 只有一条示例友链 "夏夜流萤"（`blog.cuteleaf.cn`），且 `enabled: false`。
- **操作**:
  - 如果有真实友链：添加并把 `enabled` 设为 `true`。
  - 如果没有：清空 `friendsConfig` 数组或保持关闭。

### 6. 确认赞助收款码图片
- [ ] **路径**: `public/assets/images/sponsor/alipay.png` 和 `wechat.png`
- **问题**: 这两张收款码存在，但需要确认是否是你自己的。
- **操作**: 扫码确认收款账户是不是你本人。如果不是，替换为你自己的收款码，否则别人赞助会打到别人账上。

---

## 🟢 低优先级（不影响使用，建议顺手清理）

### 7. 替换项目 README
- [ ] **文件**: 根目录 `README.md`
- **问题**: 目前还是 Firefly 官方模板的 README。
- **操作**: 替换为你自己项目的简介、部署说明或个人备注。

### 8. 修改 package.json 项目名
- [ ] **文件**: `package.json`（第 2 行）
- **问题**: `"name": "firefly"` 还是模板默认名。
- **操作**: 改为你自己喜欢的项目名，例如 `"name": "muchstarlight-blog"`。

### 9. 清理不需要的 GitHub Actions
- [ ] **文件**: `.github/workflows/deploy.yml`
- **问题**: 你的站点部署在 Vercel（`blog.muchstarlight.top`），这个 GitHub Pages 部署工作流可能用不上。
- **操作**: 如果确认不使用 GitHub Pages，可删除此文件。

### 10. 配置 Footer（如需备案号）
- [ ] **文件**: `src/config/footerConfig.ts`
- **问题**: `enable: false`，未启用。
- **操作**: 如需添加备案号、ICP 信息或自定义底部 HTML，把 `enable` 改为 `true` 并编辑 `config/FooterConfig.html`。

---

## ✅ 已正确自定义的项目（无需修改）

- [x] 站点标题、URL、描述、关键词
- [x] 博主资料（头像、昵称、签名、GitHub / 邮箱 / RSS）
- [x] 横幅文字、图片来源标注
- [x] 导航栏菜单
- [x] 关于页面 / 友链页面 / 留言板内容
- [x] 相册配置与图片
- [x] 站点运行日期、时区、语言
- [x] 已发布个人文章

---

*最后检查时间: 2026-04-25*
