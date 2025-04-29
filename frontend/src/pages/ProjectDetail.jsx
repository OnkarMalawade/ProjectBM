"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/AuthContext"

const ProjectDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("details")

  // Bid form state
  const [bidAmount, setBidAmount] = useState("")
  const [bidDuration, setBidDuration] = useState("")
  const [bidMessage, setBidMessage] = useState("")
  const [submittingBid, setSubmittingBid] = useState(false)

  // Check if user has already bid on this project
  const [userHasBid, setUserHasBid] = useState(false)
  const [userBid, setUserBid] = useState(null)

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectResponse = await axios.get(`/projects/${id}`)
        setProject(projectResponse.data)

        // If user is client, fetch bids for this project
        if (user?.role === "client") {
          const bidsResponse = await axios.get(`/bids/project/${id}`)
          setBids(bidsResponse.data)
        } else if (user?.role === "freelancer") {
          // Check if freelancer has already bid on this project
          const freelancerBidsResponse = await axios.get("/bids/freelancer")
          const projectBids = freelancerBidsResponse.data.filter((bid) => bid.project.id === Number.parseInt(id))

          if (projectBids.length > 0) {
            setUserHasBid(true)
            setUserBid(projectBids[0])
          }
        }
      } catch (error) {
        console.error("Error fetching project details:", error)
        setError("Failed to load project details")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()
  }, [id, user])

  const handleBidSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setSubmittingBid(true)

    try {
      await axios.post("/bids", {
        amount: Number.parseFloat(bidAmount),
        duration_days: Number.parseInt(bidDuration),
        message: bidMessage,
        projectId: Number.parseInt(id),
      })

      setSuccess("Your bid has been submitted successfully")
      setUserHasBid(true)

      // Refresh the page to show the new bid
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit bid")
    } finally {
      setSubmittingBid(false)
    }
  }

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.patch(`/bids/${bidId}/accept`)
      setSuccess("Bid accepted successfully")

      // Refresh the page to show the updated status
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept bid")
    }
  }

  const containerStyle = {
    padding: "20px",
  }

  const headingStyle = {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "8px",
  }

  const subheadingStyle = {
    color: "#666",
    marginBottom: "24px",
  }

  const tabsContainerStyle = {
    display: "flex",
    borderBottom: "1px solid #ddd",
    marginBottom: "24px",
  }

  const tabStyle = {
    padding: "12px 24px",
    cursor: "pointer",
    borderBottom: "2px solid transparent",
  }

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: "2px solid #4CAF50",
    fontWeight: "bold",
  }

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    marginBottom: "24px",
  }

  const cardHeaderStyle = {
    padding: "16px",
    borderBottom: "1px solid #eee",
  }

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "4px",
  }

  const cardDescriptionStyle = {
    fontSize: "14px",
    color: "#666",
  }

  const cardContentStyle = {
    padding: "16px",
  }

  const cardFooterStyle = {
    padding: "16px",
    borderTop: "1px solid #eee",
  }

  const buttonContainerStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  }

  const buttonStyle = {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    color: "#333",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const labelStyle = {
    fontWeight: "500",
  }

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "16px",
  }

  const textareaStyle = {
    ...inputStyle,
    minHeight: "150px",
    resize: "vertical",
  }

  const alertStyle = {
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "16px",
  }

  const errorAlertStyle = {
    ...alertStyle,
    backgroundColor: "#f8d7da",
    color: "#721c24",
  }

  const successAlertStyle = {
    ...alertStyle,
    backgroundColor: "#d4edda",
    color: "#155724",
  }

  if (loading) {
    return <div style={containerStyle}>Loading project details...</div>
  }

  if (!project) {
    return <div style={containerStyle}>Project not found</div>
  }

  return (
    <div style={containerStyle}>
      <div>
        <h1 style={headingStyle}>{project.title}</h1>
        <p style={subheadingStyle}>
          Budget: ${project.budget} • Status: {project.status}
        </p>
      </div>

      {error && <div style={errorAlertStyle}>{error}</div>}

      {success && <div style={successAlertStyle}>{success}</div>}

      <div style={tabsContainerStyle}>
        <div style={activeTab === "details" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("details")}>
          Project Details
        </div>
        {user?.role === "client" && (
          <div style={activeTab === "bids" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("bids")}>
            Bids
          </div>
        )}
        {user?.role === "freelancer" && (
          <div style={activeTab === "bid" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("bid")}>
            Place Bid
          </div>
        )}
      </div>

      {activeTab === "details" && (
        <div>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>Description</h3>
            </div>
            <div style={cardContentStyle}>
              <p style={{ whiteSpace: "pre-line" }}>{project.description}</p>
            </div>
          </div>

          <div style={buttonContainerStyle}>
            <button style={outlineButtonStyle} onClick={() => navigate(`/messages/${project.id}`)}>
              Messages
            </button>
            <button style={outlineButtonStyle} onClick={() => navigate(`/files/${project.id}`)}>
              Files
            </button>
            <button style={outlineButtonStyle} onClick={() => navigate(`/milestones/${project.id}`)}>
              Milestones
            </button>
          </div>
        </div>
      )}

      {activeTab === "bids" && user?.role === "client" && (
        <div>
          {bids.length === 0 ? (
            <div style={cardStyle}>
              <div style={cardContentStyle}>
                <p>No bids have been placed on this project yet.</p>
              </div>
            </div>
          ) : (
            <div>
              {bids.map((bid) => (
                <div key={bid.id} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <h3 style={cardTitleStyle}>Bid from {bid.freelancer.name}</h3>
                    <div style={cardDescriptionStyle}>
                      Amount: ${bid.amount} • Duration: {bid.duration_days} days • Status: {bid.status}
                    </div>
                  </div>
                  <div style={cardContentStyle}>
                    <p style={{ whiteSpace: "pre-line" }}>{bid.message}</p>
                  </div>
                  <div style={cardFooterStyle}>
                    {bid.status === "pending" && (
                      <button style={buttonStyle} onClick={() => handleAcceptBid(bid.id)}>
                        Accept Bid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "bid" && user?.role === "freelancer" && (
        <div>
          {userHasBid ? (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>Your Bid</h3>
                <div style={cardDescriptionStyle}>
                  Amount: ${userBid?.amount} • Duration: {userBid?.duration_days} days • Status: {userBid?.status}
                </div>
              </div>
              <div style={cardContentStyle}>
                <p style={{ whiteSpace: "pre-line" }}>{userBid?.message}</p>
              </div>
            </div>
          ) : (
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>Place a Bid</h3>
                <div style={cardDescriptionStyle}>Submit your proposal for this project</div>
              </div>
              <div style={cardContentStyle}>
                <form onSubmit={handleBidSubmit} style={formStyle}>
                  <div style={inputGroupStyle}>
                    <label htmlFor="bidAmount" style={labelStyle}>
                      Bid Amount (USD)
                    </label>
                    <input
                      id="bidAmount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="e.g., 500"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label htmlFor="bidDuration" style={labelStyle}>
                      Duration (Days)
                    </label>
                    <input
                      id="bidDuration"
                      type="number"
                      min="1"
                      value={bidDuration}
                      onChange={(e) => setBidDuration(e.target.value)}
                      placeholder="e.g., 30"
                      required
                      style={inputStyle}
                    />
                  </div>

                  <div style={inputGroupStyle}>
                    <label htmlFor="bidMessage" style={labelStyle}>
                      Cover Letter
                    </label>
                    <textarea
                      id="bidMessage"
                      value={bidMessage}
                      onChange={(e) => setBidMessage(e.target.value)}
                      placeholder="Explain why you're the best fit for this project"
                      style={textareaStyle}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      ...buttonStyle,
                      opacity: submittingBid ? 0.7 : 1,
                    }}
                    disabled={submittingBid}
                  >
                    {submittingBid ? "Submitting..." : "Submit Bid"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectDetail
 