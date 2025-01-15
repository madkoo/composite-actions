# Set repository permissions

This composite action enables to update permissions for Teams or users in a single or multiple repositories through a workflow



## usages:

```yaml

- uses: madkoo/set-repo-permissions@v2
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    target-org: "Target organization name where repositories are located" 
    repositories: "['repo1', 'repo2']"
    teamsOrUsers : "['team1,admin', 'team2,write', 'team3,read']" #Or users : "['user1,admin', 'user2,write', 'user3,read']"
    action-type: "TEAM" #or USER
    issue-nr : "1"
    target-repo: "repository name where the issue is located"

```

## Sample worfklow and issue template can be found here:

[Workflow](./samples/sample_issue_template.yml)

[Issue template](./samples/sample_issue_template.md)
