import * as core from '@actions/core'
import {Octokit} from '@octokit/rest'

//map a team to a repository
const mapTeamToRepo = async function (octokit,org,owner,repo,team_slug,permission) {
  try {
    return await octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org,
      team_slug,
      owner,
      repo,
      permission
    })
  } catch (e) {
    console.log(e)
    return
  }
}

async function run() {
  try {
    const token = core.getInput('token')
    const ownerAndorg = core.getInput('target-org')
    const repositories = core.getInput('repositories')
    const teamsOrUser = core.getInput('teamsOrUsers')
    const actionType = core.getInput('action-type')
    const issueNr = core.getInput('issue-nr')
    const targetRepo = core.getInput('target-repo')
    const octokit = new Octokit({auth: token})

    if (!repositories) {
      core.setFailed('No repositories found')
      return
    }

    const parsedRepos = JSON.parse(repositories)
    const parsedTeams = JSON.parse(teamsOrUser)

    //loop through the repositories
    for (const repo of parsedRepos) {
      //loop through the teams
      for (const team of parsedTeams) {
        if (actionType === 'TEAM') {
          const teamSlug = team.teamSlug
          const teamPermission = team.permission

          core.info(
            `map repository ${repo} to team: ${teamSlug}, with permission ${teamPermission}`
          )

          mapTeamToRepo(
            octokit,
            ownerAndorg,
            ownerAndorg,
            repo,
            teamSlug,
            teamPermission
          )
        } else {
          const user = team.user
          const userPermission = team.permission

          core.info(
            `map repository ${repo} to user: ${user}, with permission ${userPermission}`
          )

          octokit.rest.repos.addCollaborator({
            owner: ownerAndorg,
            repo,
            username: user,
            permission: userPermission
          })
        }
      }
    }

    const body = `
        ## 🎉 Mapped repositories to team
      
        ### Teams: 
        \`\`\`
        ${parsedTeams}
        \`\`\`
        ### Repositories:
        \`\`\`
        ${repositories}
        \`\`\`
      `

    await octokit.rest.issues.createComment({
      issue_number: Number(issueNr),
      owner: ownerAndorg,
      repo: targetRepo,
      body: body.replace(/  +/g, '')
    })
  } catch (error: any) {
    core.setFailed(error.message)
  }
}
run()

export default run // For testing