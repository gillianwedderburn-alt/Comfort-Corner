<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep conversation card content in `src/data/talkCards.ts` and card interactions in `src/components/TalkCards.tsx`, so content stays editable independently of the player.
- Keep home section selection in the index component's React state behind the existing gate, so both sections share access without persisting navigation.
- Use the Button component's comfort variants and semantic talk color tokens for new controls, so the additions match the existing app and support dark mode.
