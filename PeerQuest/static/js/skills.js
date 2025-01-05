document.addEventListener('DOMContentLoaded', () => {
    const rolesData = {
      Researcher: {
        count: 5,
        skills: {
          'Data Analysis': { progress: 70, pod: 'Pod X' },
          'Report Writing': { progress: 85, pod: 'Pod Y' }
        }
      },
      Explainer: {
        count: 8,
        skills: {
          Communication: { progress: 90, pod: 'Pod Z' },
          Presentation: { progress: 60, pod: 'Pod A' }
        }
      },
      Challenger: {
        count: 3,
        skills: {
          'Critical Thinking': { progress: 50, pod: 'Pod B' },
          Debating: { progress: 75, pod: 'Pod C' }
        }
      },
      Moderator: {
        count: 6,
        skills: {
          'Conflict Resolution': { progress: 40, pod: 'Pod D' },
          Facilitation: { progress: 95, pod: 'Pod E' }
        }
      },
      Innovator: {
        count: 4,
        skills: {
          'Creative Thinking': { progress: 65, pod: 'Pod F' },
          'Problem Solving': { progress: 80, pod: 'Pod G' }
        }
      }
    };
  
    const skillsData = {
      PYTHON: { role: 'Researcher', progress: 70, pod: 'Pod X' },
      JAVA: { role: 'Explainer', progress: 85, pod: 'Pod Y' },
      'C++': { role: 'Challenger', progress: 60, pod: 'Pod Z' },
      'REACT JS': { role: 'Moderator', progress: 90, pod: 'Pod A' },
      ANGULAR: { role: 'Innovator', progress: 50, pod: 'Pod B' }
    };
  
    updateRoles(rolesData);
    updateSkills(skillsData);
  });
  
  function updateRoles(rolesData) {
    const rolesList = document.getElementById('rolesList');
    const topRoleElement = document.querySelector('.top-role');
  
    if (!rolesList || !topRoleElement) {
      console.error("Couldn't find rolesList or topRole element");
      return;
    }
  
    rolesList.innerHTML = '';
    let maxCount = 0;
    let topRole = '';
  
    const sortedRoles = Object.entries(rolesData).sort(([, a], [, b]) => b.count - a.count);
  
    sortedRoles.forEach(([role, { count, skills }]) => {
      if (count > maxCount) {
        maxCount = count;
        topRole = role;
      }
  
      const roleBox = document.createElement('div');
      roleBox.classList.add('role-box');
  
      const roleName = document.createElement('div');
      roleName.classList.add('role-name');
      roleName.textContent = role;
      roleBox.appendChild(roleName);
  
      const progressBar = document.createElement('div');
      progressBar.classList.add('progress-bar');
      const progressBarFill = document.createElement('div');
      progressBarFill.classList.add('progress-bar-fill');
      progressBarFill.style.width = `${(count / maxCount) * 100}%`;
      progressBar.appendChild(progressBarFill);
      roleBox.appendChild(progressBar);
  
      Object.entries(skills).forEach(([skill, { progress, pod }]) => {
        const skillInfo = document.createElement('p');
        skillInfo.classList.add('skill-info');
        skillInfo.textContent = `${skill} (${progress}%, ${pod})`;
        roleBox.appendChild(skillInfo);
      });
  
      rolesList.appendChild(roleBox);
    });
  
    topRoleElement.textContent = `Most Frequent Role: ${topRole}`;
  }
  
  function updateSkills(skillsData) {
    const skillsGrid = document.getElementById('skillsGrid');
    
    if (!skillsGrid) {
      console.error("Couldn't find skillsGrid element");
      return;
    }
  
    skillsGrid.innerHTML = '';
  
    Object.entries(skillsData).forEach(([skill, { role, progress, pod }]) => {
      const skillBox = document.createElement('div');
      skillBox.classList.add('skill-box');
      skillBox.addEventListener('click', () => displaySkillInfo(role, skill, progress, pod));
  
      const skillName = document.createElement('h4');
      skillName.classList.add('skill-name');
      skillName.textContent = skill;
      skillBox.appendChild(skillName);
  
      const progressMeter = document.createElement('div');
      progressMeter.classList.add('progress-meter');
      const progressFill = document.createElement('div');
      progressFill.classList.add('progress-fill');
      progressFill.style.width = `${progress}%`;
      progressMeter.appendChild(progressFill);
      skillBox.appendChild(progressMeter);
  
      const skillInfo = document.createElement('p');
      skillInfo.classList.add('skill-info');
      skillInfo.textContent = `Role: ${role}, Pod: ${pod}`;
      skillBox.appendChild(skillInfo);
  
      skillsGrid.appendChild(skillBox);
    });
  }
  
  function displaySkillInfo(role, skill, progress, pod) {
    alert(`Role: ${role}\nSkill: ${skill}\nProgress: ${progress}%\nPod: ${pod}`);
  }