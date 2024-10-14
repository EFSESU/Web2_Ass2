// Wait for the DOM content to load before executing the script
document.addEventListener('DOMContentLoaded', async () => {
  const fundraisersContainer = document.getElementById('fundraiserTable').getElementsByTagName('tbody')[0];

  try {
    const response = await fetch('/api'); // Fetch all fundraisers from the API
    const fundraisers = await response.json();

    // Iterate over the fetched fundraisers and add them to the table
    fundraisers.forEach(fundraiser => {
      const row = fundraisersContainer.insertRow();
      row.insertCell(0).textContent = fundraiser.FUNDRAISE_ID;
      row.insertCell(1).textContent = fundraiser.ORGANIZER;
      row.insertCell(2).textContent = fundraiser.CAPTION;
      row.insertCell(3).textContent = fundraiser.TARGET_FUNDING;
      row.insertCell(4).textContent = fundraiser.CURRENT_FUNDING;
      row.insertCell(5).textContent = fundraiser.CITY;
      row.insertCell(6).textContent = fundraiser.ACTIVE ? 'Active' : 'Inactive';
      row.insertCell(7).textContent = fundraiser.CATEGORY_NAME;

      // 添加操作栏
      const actionsCell = row.insertCell(8);
      const detailsButton = document.createElement('button');
      detailsButton.textContent = 'Details';
      detailsButton.onclick = () => viewDetails(fundraiser.FUNDRAISE_ID);
      actionsCell.appendChild(detailsButton);
    });
  } catch (error) {
    console.error('Error fetching fundraisers:', error);
  }
});

// 查看详情按钮点击事件
function viewDetails(id) {
  window.location.href = `/fundraiser?id=${id}`; // 跳转到详情页面并传递筹款活动ID
}

// Function to navigate to the search page
function searchForm() {
  window.location.href = "search";
}

function addForm() {
  window.location.href = "addadmin";
}

// 更新筹款活动函数
function updateFundraiser(id) {
  // 处理更新操作
  console.log('Updating fundraiser with ID:', id);
  // 你可以在这里添加实际的更新逻辑
  // 跳转到表单页面并传递筹款活动的ID
  window.location.href = `/addadmin?id=${id}`;
}


// 删除筹款活动函数
function deleteFundraiser(id) {
  // 弹出确认对话框
  if (confirm('Are you sure you want to delete this fundraiser?')) {
    // 用户确认后调用API删除筹款活动
    fetch(`/api/fundraiser/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        // 删除成功后从表格中移除该行
        const row = document.querySelector(`#fundraiserTable tbody tr[data-id="${id}"]`);
        if (row) {
          row.remove();
        }
        alert('Fundraiser deleted successfully!');
        window.location.reload();
      } else {
        return response.json().then(data => {
          alert('Failed to delete fundraiser: ' + data.message);
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while deleting the fundraiser.');
    });
  }
}

function back(){
  window.location.href = "index.html";
}