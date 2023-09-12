# Contributing to Ultimate-Prep

First off, thank you for considering contributing to Ultimate Job Application Assistant! It's people like you that make the Open Source thrive!

## Where do I go from here?

If you've noticed a bug or have a question, [search the issue tracker](https://github.com/yourusername/ultimate-prep/issues) to see if someone else has already created a ticket. If not, go ahead and [make one](https://github.com/yourusername/ultimate-prep/issues/new)!

## Fork & create a branch

If this is something you think you can fix, then [fork Ultimate-Prep](https://help.github.com/articles/fork-a-repo) and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):
```bash
git checkout -b 325-add-japanese-localisation
```

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; 😸

Try to always add tests where possible, this makes this whole thing less bug prone and allows breaking changes to be quickly detected.

## Get the style right

Your patch should follow the same syntax and semantic. We use `Conventional Commits Extension for VSCode` in order to make a standart for commits.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Ultimate-Prep's master branch:
```bash
git checkout 325-add-japanese-localisation
git pull --rebase upstream master
git push --force-with-lease 325-add-japanese-localisation
```


## Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

- It is passing CI. (Not yet implemented)
- It has been approved by the owner, or two maintainers.
- It has no requested changes.
- It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are met.

Please replace yourusername with your actual GitHub username. This guide assumes that contributors have a basic understanding of how to use Git and GitHub.