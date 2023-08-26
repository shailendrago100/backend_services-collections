const mailchimp = require("@mailchimp/mailchimp_transactional")(
    "2a15349bac89e12e1fe5616a28f436c2-us17"
  );
  
  const message = {
    from_email: "test.seraphic15@gmail.com",
    subject: "Hello world",
    text: "Welcome to Mailchimp Transactional!",
    to: [
      {
        email: "ayushmina10@gmail.com",
        type: "to"
      }
    ]
  };
  
  async function run() {
    const response = await mailchimp.messages.send({
      message
    });
    console.log(response);
  }
//   run();
const audienlistCreate= async (req, res) => {
    const { name, company, address, city, state, zip, country, from_name, from_email, subject, language } = req.body

    const footerContactInfo = { company, address1: address, city, state, zip, country }

    const campaignDefaults = { from_name, from_email, subject, language }

    async function listCreateList() {
        try {
            const audience = await mailchimp.lists.createList({
                name: name,
                contact: footerContactInfo,
                permission_reminder: "*|LIST:DESCRIPTION|*",
                email_type_option: true,
                campaign_defaults: campaignDefaults
            })

            res.send(audience.id)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    listCreateList();
}

const addMemberInList = async (req, res) => {
    const { listId, firstname, lastname, email, tag } = req.body

    const addListMember = async () => {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: email,
                status: 'subscribed',
                email_type: 'html',
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                },
                tags: [tag]
            })
            res.send(response)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    addListMember()
}

const addMemberSInList = async (req, res) => {
    const { listId, members } = req.body

    const membersList = []
    members.forEach(member => {
        const memberDetails = {
            email_address: member.email_address,
            email_type: 'html',
            status: 'subscribed',
            merge_fields: {
                FNAME: member.firstname,
                LNAME: member.lastname
            }
        }
        membersList.push(memberDetails)
    })

    const addMultipleMembers = async () => {
        try {
            const response = await mailchimp.lists.batchListMembers(listId, {
                members: membersList,
                update_existing: true
            })
            res.send(response)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    addMultipleMembers()
}

const audienceCreateSegment= async (req, res) => {

    const { listId, segment_name, emailList } = req.body

    const conditions = []
    emailList.forEach(email => {
        conditions.push(
            {
                "field": "EMAIL",
                "op": "contains",
                "value": email // email address
            })
    })

    const createSegment = async () => {
        try {
            const response = await mailchimp.lists.createSegment(listId, {
                name: segment_name,
                options: {
                    match: 'any',
                    conditions: conditions
                }
            })
            res.send(response)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    createSegment()
}
const createTemplate = async (req, res) => {
    const { templateName } = req.body

    const createTemplate = async (err, htmlTemplate) => {
        if (err) {
            res.send("An error occured while reading template html file!")
        }
        try {
            const template = await mailchimp.templates.create({
                name: templateName,
                html: htmlTemplate
            })
            res.send(template.id)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    fs.readFile('./template.html', 'utf8', createTemplate)
}
const campaignSend = async  (req, res) => {
    const { ListId, SegmentId, tempalteId, subjectLine, previewText, campaignTitle, fromName, replyTo } = req.body

    const createCampaign = async () => {
        try {
            const campaign = await mailchimp.campaigns.create({
                type: "regular",
                recipients: {
                    segment_opts: {
                        saved_segment_id: SegmentId,
                        match: 'any'
                    },
                    list_id: ListId
                },
                settings: {
                    subject_line: subjectLine,
                    preview_text: previewText,
                    title: campaignTitle,
                    template_id: tempalteId,
                    from_name: fromName,
                    reply_to: replyTo,
                    to_name: "*|FNAME|*",
                    auto_footer: true,
                    inline_css: true,

                }
            })
            return campaign.id
        }
        catch (err) {
            res.status(400).send(err)
        }
    }

    const sendCampaign = async (campaignId) => {
        try {
            await mailchimp.campaigns.send(campaignId)
            res.redirect("success.html")
        }
        catch (e) {
            res.redirect("fail.html")
        }
    }

    const campaignId = await createCampaign()
    sendCampaign(campaignId)
}